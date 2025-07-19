from rest_framework import viewsets, permissions, filters as drf_filters
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Category, Transaction
from .serializers import CategorySerializer, TransactionSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import TransactionFilter
from django.db.models import Sum
from collections import defaultdict

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


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
        return Transaction.objects.filter(user=self.request.user, archivado=False)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='archivar')
    def archivar(self, request, pk=None):
        transaccion = self.get_object()
        transaccion.archivado = True
        transaccion.save()
        return Response({'status': 'Transacción archivada'}, status=status.HTTP_200_OK)

class EstadisticasTransaccionesAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        transacciones = Transaction.objects.filter(user=user, archivado=False)

        total_ingresos = transacciones.filter(type='ingreso').aggregate(total=Sum('amount'))['total'] or 0
        total_egresos = transacciones.filter(type='egreso').aggregate(total=Sum('amount'))['total'] or 0
        saldo = total_ingresos - total_egresos

        por_categoria = defaultdict(float)
        for trans in transacciones.select_related('category'):
            nombre = trans.category.name if trans.category else "Sin categoría"
            por_categoria[nombre] += float(trans.amount)  # 💥 ¡Acá está la solución!

        return Response({
            "total_ingresos": total_ingresos,
            "total_egresos": total_egresos,
            "saldo": saldo,
            "por_categoria": por_categoria
        })