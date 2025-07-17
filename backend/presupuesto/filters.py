from django_filters import rest_framework as filters
from .models import Transaction

class TransactionFilter(filters.FilterSet):
    category_name = filters.CharFilter(field_name='category__name', lookup_expr='icontains')
    description = filters.CharFilter(field_name='description', lookup_expr='icontains') 


    class Meta:
        model = Transaction
        fields = ['category', 'category_name']
