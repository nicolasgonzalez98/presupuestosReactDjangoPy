from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TransactionViewSet, EstadisticasTransaccionesAPIView, RegisterAPIView, GetUserView

router = DefaultRouter()

router.register(r'categories', CategoryViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('transactions/estadisticas', EstadisticasTransaccionesAPIView.as_view(), name='transactions-estadisticas'),
    path('register', RegisterAPIView.as_view(), name='register'),
    path('get_user/', GetUserView.as_view(), name="get_user")
]
