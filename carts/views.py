from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Cart, CartItems
from .serializers import CartSerializer, CartItemSerializer
from customer.models import Customer
from food.models import FoodItem
from rest_framework.response import Response
from rest_framework import status


class CartViewset(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # customer_id = self.request.query_params.get('customer_id')   # search using customer id 
        user_id = self.request.query_params.get('user_id')    #search using user id
        if user_id:
            queryset = queryset.filter(customer__user__id=user_id)
        return queryset
    
    def create(self, request, *args, **kwargs):
        customer = Customer.objects.get(user=request.user)
        cart, created = Cart.objects.get_or_create(user=customer, ordered=False)
        return Response(CartSerializer(cart).data)
    
class CartItemViewset(viewsets.ModelViewSet):
    queryset = CartItems.objects.all()
    serializer_class = CartItemSerializer

    def create(self, request, *args, **kwargs):
        customer_id = request.data.get('customer')
        fooditem_id = request.data.get('fooditem')
        quantity = request.data.get('quantity', 1)
        quantity = int(quantity)
        try:
            customer = Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer does not exist'}, status=400)
        cart, created = Cart.objects.get_or_create(customer=customer, ordered=False)  # if the customer has no cart then this will create a new cart
        try:
            food_item = FoodItem.objects.get(id=fooditem_id)
        except FoodItem.DoesNotExist:
            return Response({'error': 'Food item does not exist'}, status=400)
        cart_item, item_created = CartItems.objects.get_or_create(cart=cart, fooditem=food_item, customer=customer)

        if not item_created:
            cart_item.quantity += quantity
            cart_item.price = cart_item.quantity * food_item.discounted_price   #ekhane update korsi
        else:
            cart_item.quantity = quantity
        cart.total_price += float(food_item.price)
        cart_item.save()
        cart.save()
        return Response({'message': 'Item added to cart'})


    def get_queryset(self):                                           # this part is to find the specific user's specific food that he orders or not
        queryset = super().get_queryset()
        customer_id = self.request.query_params.get('customer_id')
        fooditem_id = self.request.query_params.get('fooditem_id')
        if customer_id and fooditem_id:
            queryset = queryset.filter(customer_id=customer_id, fooditem_id=fooditem_id)
        return queryset
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # print(kwargs)
        # print(instance)
        # print('hi')
        cart = instance.cart
        # print("cart : ")
        # print(cart)
        # print(cart.id)
        cart.total_price -= instance.price
        # print("cart total price : ")
        # print( cart.total_price)
        cart.save()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    # def destroy(self, request, *args, **kwargs):
    #     queryset = super().get_queryset()
    #     # customer_id = request.query_params.get('customer_id')
    #     # fooditem_id = request.query_params.get('fooditem_id')
    #     # if customer_id and fooditem_id:
    #     #     queryset = queryset.filter(customer_id=customer_id, fooditem_id=fooditem_id)
    #     if queryset.exists():
    #         cart_item = queryset.first()
    #         cart = cart_item.cart
    #         cart.total_price -= cart_item.price
    #         cart.save()
    #         cart_item.delete()
    #         return Response(status=status.HTTP_204_NO_CONTENT)
    #     else:
    #         return Response({'error': 'Cart item not found'})


    # def destroy(self, request, *args, **kwargs):
    #     customer_id = request.query_params.get('customer_id')
    #     fooditem_id = request.query_params.get('fooditem_id')

    #     try:
    #         cart_item = CartItems.objects.get(customer_id=customer_id, fooditem_id=fooditem_id)
    #         cart = Cart.objects.get(customer_id=customer_id)
    #         cart.total_price -= cart_item.price
    #         cart.save()
    #         cart_item.delete()
    #         # self.perform_destroy(cart_item)
    #         return Response({'message': 'Item deleted successfully'})
    #     except CartItems.DoesNotExist:
    #         return Response({'error': 'Item not found'})
        
    
    # def destroy(self, request, *args, **kwargs):
    #     customer_id = request.query_params.get('customer_id')
    #     fooditem_id = request.query_params.get('fooditem_id')

    #     try:
    #         cart_item = CartItems.objects.get(customer_id=customer_id, fooditem_id=fooditem_id)
    #         cart = Cart.objects.get(customer_id=customer_id, ordered=False)
    #         cart.total_price -= cart_item.price * cart_item.quantity
    #         cart.save()
    #         cart_item.delete()

    #         return Response({'message': 'Item deleted successfully'}, status=status.HTTP_200_OK)
    #     except CartItems.DoesNotExist:
    #         return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

    #     except Cart.DoesNotExist:
    #         return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)



    # def destroy(self, request, *args, **kwargs):
    #     customer_id = request.query_params.get('customer_id')
    #     fooditem_id = request.query_params.get('fooditem_id')

    #     try:
    #         cart_item = CartItems.objects.get(customer_id=customer_id, fooditem_id=fooditem_id)
    #         cart = Cart.objects.get(customer_id=customer_id, ordered=False)
    #         cart.total_price -= cart_item.price * cart_item.quantity
    #         cart.save()
    #         cart_item.delete()
    #         return Response({'message': 'Item deleted successfully'}, status=status.HTTP_200_OK)
    #     except CartItems.DoesNotExist:
    #         return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    #     except Cart.DoesNotExist:
    #         return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)







    # def destroy(self, request, *args, **kwargs):
    #     queryset = super().get_queryset()
    #     if queryset.exists():
    #         instance = self.get_object()
    #         # print(kwargs)
    #         # print(instance)
    #         # print('hi')
    #         cart = instance.cart
    #         # print("cart : ")
    #         # print(cart)
    #         # print(cart.id)
    #         cart.total_price -= instance.price
    #         # print("cart total price : ")
    #         # print( cart.total_price)
    #         cart.save()
    #         self.perform_destroy(instance)
    #         return Response(queryset,status=status.HTTP_204_NO_CONTENT)
    #     else:
    #         return Response({'error': 'Cart item not found'})
        

