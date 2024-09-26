from django.shortcuts import render

# Create your views here.

from .serializers import FoodOrderSerializer
from .models import FoodOrder
from rest_framework import viewsets


class FoodOrderViewset(viewsets.ModelViewSet):
    queryset = FoodOrder.objects.all()
    serializer_class = FoodOrderSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        return queryset

