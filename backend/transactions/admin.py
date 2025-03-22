from django.contrib import admin
from .models import Transaction, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'user')
    list_filter = ('user',)
    search_fields = ('name',)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('title', 'amount', 'category', 'user', 'created_at')
    list_filter = ('category', 'user', 'created_at')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'
