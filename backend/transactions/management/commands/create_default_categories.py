from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from transactions.models import Category


class Command(BaseCommand):
    help = 'Creates default transaction categories for a specified user'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username to create default categories for')

    def handle(self, *args, **options):
        username = options['username']
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User "{username}" does not exist'))
            return
        
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
        
        created_count = 0
        existing_count = 0
        
        for category_data in default_categories:
            # Check if category already exists for this user
            if not Category.objects.filter(user=user, name=category_data['name']).exists():
                Category.objects.create(
                    user=user,
                    name=category_data['name'],
                    color=category_data['color']
                )
                created_count += 1
            else:
                existing_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} categories for user "{username}" '
                f'({existing_count} already existed)'
            )
        ) 