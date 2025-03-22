from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    """
    Model for transaction categories
    """
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=20)  # Store hex color code
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'


class Transaction(models.Model):
    """
    Model for financial transactions (income and expenses)
    """
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Positive for income, negative for expense")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.amount}"

    class Meta:
        ordering = ['-created_at']
