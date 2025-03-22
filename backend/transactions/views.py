from django.shortcuts import render
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth, TruncDay
import csv
import xlwt
from datetime import datetime, timedelta
from .models import Category, Transaction
from .serializers import CategorySerializer, TransactionSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for user's transaction categories
    """
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return categories belonging to the current user
        return Category.objects.filter(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for user's financial transactions
    """
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'amount', 'category']
    ordering = ['-created_at']  # Default ordering

    def get_queryset(self):
        """
        Return transactions for the current user with optional filtering
        """
        queryset = Transaction.objects.filter(user=self.request.user)
        
        # Filter by category
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filter by transaction type (income/expense)
        transaction_type = self.request.query_params.get('type', None)
        if transaction_type == 'income':
            queryset = queryset.filter(amount__gt=0)
        elif transaction_type == 'expense':
            queryset = queryset.filter(amount__lt=0)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)
        
        # Filter by amount range
        min_amount = self.request.query_params.get('min_amount', None)
        max_amount = self.request.query_params.get('max_amount', None)
        
        if min_amount:
            queryset = queryset.filter(amount__gte=min_amount)
        if max_amount:
            queryset = queryset.filter(amount__lte=max_amount)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def balance(self, request):
        """
        Returns the current balance for the authenticated user
        """
        # Get sum of all amounts for the current user
        balance = self.get_queryset().aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            'balance': balance,
            'currency': request.query_params.get('currency', 'USD')  # Default to USD if not specified
        })
    
    @action(detail=False, methods=['get'])
    def category_summary(self, request):
        """
        Returns expense summary by category for the current month
        """
        # Get first day of current month
        today = datetime.now()
        first_day = datetime(today.year, today.month, 1)
        
        # Filter transactions: only expenses (amount < 0) for current month
        transactions = self.get_queryset().filter(
            amount__lt=0,
            created_at__gte=first_day
        )
        
        # Group by category and sum amounts
        summary = []
        for category in Category.objects.filter(user=self.request.user):
            category_expenses = transactions.filter(category=category).aggregate(Sum('amount'))['amount__sum'] or 0
            # Convert to positive value for the frontend
            if category_expenses < 0:
                summary.append({
                    'id': category.id,
                    'name': category.name,
                    'color': category.color,
                    'amount': abs(category_expenses)
                })
        
        return Response(summary)
    
    @action(detail=False, methods=['get'])
    def balance_history(self, request):
        """
        Returns daily balance history for the current month
        """
        # Get first day of current month
        today = datetime.now()
        first_day = datetime(today.year, today.month, 1)
        
        # Get all transactions for current month
        transactions = self.get_queryset().filter(created_at__gte=first_day)
        
        # Group by day and calculate cumulative balance
        daily_transactions = transactions.annotate(day=TruncDay('created_at'))\
            .values('day').annotate(amount_sum=Sum('amount')).order_by('day')
        
        # Build response with running balance
        history = []
        running_balance = 0
        
        # Generate dates for all days in the month
        current_date = first_day
        while current_date <= today:
            # Find transaction for this day if exists
            day_data = next((item for item in daily_transactions if item['day'].date() == current_date.date()), None)
            
            if day_data:
                running_balance += day_data['amount_sum']
            
            history.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'balance': running_balance
            })
            
            current_date += timedelta(days=1)
        
        return Response(history)
    
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """
        Export user's transactions as CSV
        """
        transactions = self.get_queryset()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="transactions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Title', 'Description', 'Category', 'Amount', 'Date'])
        
        for transaction in transactions:
            category_name = transaction.category.name if transaction.category else 'Uncategorized'
            writer.writerow([
                transaction.title,
                transaction.description or '',
                category_name,
                transaction.amount,
                transaction.created_at.strftime('%Y-%m-%d %H:%M')
            ])
        
        return response
    
    @action(detail=False, methods=['get'])
    def export_excel(self, request):
        """
        Export user's transactions as Excel
        """
        transactions = self.get_queryset()
        
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = f'attachment; filename="transactions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xls"'
        
        wb = xlwt.Workbook(encoding='utf-8')
        ws = wb.add_sheet('Transactions')
        
        # Sheet header
        row_num = 0
        font_style = xlwt.XFStyle()
        font_style.font.bold = True
        
        columns = ['Title', 'Description', 'Category', 'Amount', 'Date']
        
        for col_num, column_title in enumerate(columns):
            ws.write(row_num, col_num, column_title, font_style)
        
        # Sheet body
        font_style = xlwt.XFStyle()
        
        for transaction in transactions:
            row_num += 1
            category_name = transaction.category.name if transaction.category else 'Uncategorized'
            
            ws.write(row_num, 0, transaction.title, font_style)
            ws.write(row_num, 1, transaction.description or '', font_style)
            ws.write(row_num, 2, category_name, font_style)
            ws.write(row_num, 3, float(transaction.amount), font_style)
            ws.write(row_num, 4, transaction.created_at.strftime('%Y-%m-%d %H:%M'), font_style)
        
        wb.save(response)
        return response
