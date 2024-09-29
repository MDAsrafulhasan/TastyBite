from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from order.models import *
from food.serializers import *

class CartItemSerializer(serializers.ModelSerializer):
    # fooditem = serializers.StringRelatedField()  # Display food item name
    # customer = serializers.StringRelatedField(many=False)
    # fooditem = serializers.StringRelatedField(many=False)  # Display food item name
    fooditem = FoodItemSerializer(many=False)  # Display food item name
    # cart = serializers.StringRelatedField(many=False) # Display
    class Meta:
        model = CartItems
        fields = [ 'fooditem', 'price', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source='cartitems_set', many=True)  #CartItems serializer er sob dekhabe
    customer = serializers.StringRelatedField(many=False)
    class Meta:
        model = Cart
        fields = ['id', 'customer', 'ordered', 'total_price', 'items']

    def create(self, validated_data):
        customer = validated_data.get('customer')
        cart = Cart.objects.create(customer=customer)
        return cart
# class CartSerializer(serializers.ModelSerializer):
#     cartitems = CartItemSerializer(many=True, read_only=True)
#     total_price = serializers.FloatField(read_only=True)

#     class Meta:
#         model = Cart
#         fields = ['id', 'customer', 'ordered', 'total_price', 'cartitems']