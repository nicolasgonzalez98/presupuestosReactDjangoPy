from rest_framework import viewsets, permissions, filters as drf_filters
from .models import Category, Transaction
from .serializers import CategorySerializer, TransactionSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import TransactionFilter


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all() 
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    ##Filtro
    filter_backends = [DjangoFilterBackend, drf_filters.OrderingFilter]
    filterset_class = TransactionFilter
    filterset_fields = ['category']

    ##Orden
    ordering_fields = ['amount', 'date'] 
    ordering = ['-date'] 

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
