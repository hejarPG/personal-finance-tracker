from rest_framework import serializers
from .models import Category, Transaction


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color']
        read_only_fields = ['id']

    def create(self, validated_data):
        # Associate the category with the current user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'title', 'description', 'amount', 'category', 'created_at', 'category_name', 'category_color']
        read_only_fields = ['id', 'created_at', 'category_name', 'category_color']

    def create(self, validated_data):
        # Associate the transaction with the current user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data) 