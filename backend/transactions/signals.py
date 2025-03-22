from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Category


@receiver(post_save, sender=User)
def create_default_categories(sender, instance, created, **kwargs):
    """
    Create default categories when a new user is created
    """
    if created:
        # Define default categories with their colors
        default_categories = [
            {'name': 'Food & Dining', 'color': '#FF5733'},
            {'name': 'Transportation', 'color': '#33A8FF'},
            {'name': 'Entertainment', 'color': '#FF33E9'},
            {'name': 'Shopping', 'color': '#33FF57'},
            {'name': 'Housing', 'color': '#9B33FF'},
            {'name': 'Utilities', 'color': '#FFB533'},
            {'name': 'Healthcare', 'color': '#33FFC1'},
            {'name': 'Personal', 'color': '#FF3369'},
            {'name': 'Education', 'color': '#337DFF'},
            {'name': 'Salary', 'color': '#33FF33'},
            {'name': 'Investments', 'color': '#F033FF'},
            {'name': 'Gifts', 'color': '#FF8A33'},
            {'name': 'Other', 'color': '#A0A0A0'},
        ]
        
        for category_data in default_categories:
            Category.objects.create(
                user=instance,
                name=category_data['name'],
                color=category_data['color']
            ) 