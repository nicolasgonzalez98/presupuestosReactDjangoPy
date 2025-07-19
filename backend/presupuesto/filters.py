from django_filters import rest_framework as filters
from .models import Transaction

class TransactionFilter(filters.FilterSet):
    category_name = filters.CharFilter(field_name='category__name', lookup_expr='icontains')
    description = filters.CharFilter(field_name='description', lookup_expr='icontains') 

    date_from = filters.DateFilter(field_name="date", lookup_expr="gte")
    date_to = filters.DateFilter(field_name="date", lookup_expr="lte")
    min_amount = filters.NumberFilter(field_name="amount", lookup_expr="gte")
    max_amount = filters.NumberFilter(field_name="amount", lookup_expr="lte")

    class Meta:
        model = Transaction
        fields = ['category', 'category_name', 'date_from', 'date_to', 'min_amount', 'max_amount']
