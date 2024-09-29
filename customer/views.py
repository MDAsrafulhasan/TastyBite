from django.shortcuts import render

# Create your views here.
from .serializers import CustomerSerializer,ReviewSerializer,CustomerRegistrationSerializer
from .models import Customer,Review
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes
from carts.models import *
from rest_framework import serializers
from .serializers import CustomerLoginSerializer
from django.contrib.auth import authenticate,login,logout
from rest_framework.authtoken.models import Token
#for email
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string



class CustomerViewset(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        if user_id :
            queryset = queryset.filter(user_id=user_id)
        return queryset

class ReviewViewset(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        food_item_id = self.request.query_params.get('food_item_id')
        if food_item_id :
            queryset = queryset.filter(food_item_id=food_item_id)
        return queryset
    
    def create(self, request, *args, **kwargs):
        customer = Customer.objects.get(user=request.user)
        fooditem_id = request.data.get('food_item')

        if not CartItems.objects.filter(customer=customer, fooditem_id=fooditem_id).exists():
            return Response({'error': 'You can only review items you have ordered.'})
        # if Review.objects.filter(customer=customer, food_item_id=food_item_id).exists():
        #     return Response({'error': 'You have already reviewed this item.'})

        return super().create(request, *args, **kwargs)



class CustomerRegistrationViewset(APIView):
    serializer_class = CustomerRegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data = request.data)

        if serializer.is_valid():
            user = serializer.save()
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            confirm_link = f"https://tastybite.onrender.com/customer/active/{uid}/{token}"
            email_subject = "Confirm your account"
            email_body = render_to_string('confirm_email.html',{'confirm_link': confirm_link})
            email = EmailMultiAlternatives(email_subject, '', to=[user.email])
            email.attach_alternative(email_body, "text/html")
            email.send()
            return Response("Check your email for confirmation")
        return Response(serializer.errors)
    
def activate(request,uid64,token):
    try:
        uid = urlsafe_base64_decode(uid64).decode()
        user = User._default_manager.get(pk=uid)
    except(User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return redirect('http://127.0.0.1:5500/login.html')
    return redirect('register')


class CustomerLoginApiView(APIView):
    def post(self, request):
        serializer = CustomerLoginSerializer(data = self.request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(username= username, password=password)
            
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                login(request, user)
                return Response({'token' : token.key, 'user_id' : user.id})
            else:
                return Response({'error' : "Invalid Credential"})
        return Response(serializer.errors)
    
class CustomerLogoutView(APIView):
    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
         # return redirect('login')
        return redirect('http://127.0.0.1:5500/login.html')
        

