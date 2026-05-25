from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()  # eta router
router.register('foods', views.FoodItemViewset)  # eta router er antena
router.register('category', views.CategoryViewset)  # eta router er antena
router.register('favorites', views.FavoriteFoodViewset, basename='favorites')

urlpatterns = [
    path('', include(router.urls)),
]