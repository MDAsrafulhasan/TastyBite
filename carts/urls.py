from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *

# router = DefaultRouter()  # eta router
# router.register('list', views.)
router = DefaultRouter()
router.register('cart', CartViewset)
router.register('cartitems',CartItemViewset,basename='cartitem')

urlpatterns = [
    path('', include(router.urls)),
    # path('',CartView.as_view()),
]