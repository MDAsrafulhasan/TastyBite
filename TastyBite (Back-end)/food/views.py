from django.shortcuts import render

# Create your views here.
from .serializers import CategorySerializer, FoodItemSerializer, FavoriteFoodSerializer
from .models import Category, FoodItem, FavoriteFood
from rest_framework import viewsets, permissions, filters, pagination


class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit or create items.
    """
    def has_permission(self, request, view):
        # SAFE_METHODS (GET, HEAD, OPTIONS) are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to admin users (is_staff)
        return bool(request.user and request.user.is_staff)


class FoodItemViewset(viewsets.ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category__name']
    permission_classes = [IsAdminUserOrReadOnly]
    
class CategoryViewset(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]

class FavoriteFoodViewset(viewsets.ModelViewSet):
    queryset = FavoriteFood.objects.all()
    serializer_class = FavoriteFoodSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset

# class SpecialFoodItemViewset(viewsets.ModelViewSet):
#     queryset = SpecialFoodItem.objects.all()
#     serializer_class = SpecialFoodItemSerializer