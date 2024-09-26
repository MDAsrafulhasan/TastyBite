from django.shortcuts import render

# Create your views here.
from .serializers import CategorySerializer,FoodItemSerializer
from .models import Category,FoodItem
from rest_framework import viewsets
from rest_framework import filters, pagination


class FoodItemViewset(viewsets.ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category__name']
    
class CategoryViewset(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# class SpecialFoodItemViewset(viewsets.ModelViewSet):
#     queryset = SpecialFoodItem.objects.all()
#     serializer_class = SpecialFoodItemSerializer