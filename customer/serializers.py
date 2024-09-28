from rest_framework import serializers
from .models import Customer,Review
from django.contrib.auth.models import User
from order.models import FoodOrder
class CustomerSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(many=False)
    class Meta:
        model = Customer
        fields = '__all__'

class CustomCustomerSerializer(serializers.ModelSerializer):
    # image = serializers.SerializerMethodField()
    user = serializers.StringRelatedField(many=False)
    class Meta:
        model = Customer
        fields = ['id', 'user', 'image']

class ReviewSerializer(serializers.ModelSerializer):
    # customer = serializers.StringRelatedField(many=False)
    # food_item = serializers.StringRelatedField(many=False)
    customer = CustomCustomerSerializer(many=False)
    class Meta:
        model = Review
        fields = '__all__'
        # fields = ['id','customer', 'food_item','rating','comment','created_at']



        # def save(self):
        #     customer = self.context['request'].user.customer 
        #     food_item = self.validated_data['food_item']

        #     if not FoodOrder.objects.filter(customer = customer , food_item = food_item).exists():
        #         raise serializers.ValidationError({'error': "This customer has not ordered this food item yet."})
        #     review = Review(
        #     customer=customer,
        #     food_item=food_item,
        #     rating=self.validated_data['rating'],
        #     comment=self.validated_data['comment']
        #     )
        #     review.save()
        #     return review
        

class CustomerRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(required = True)
    contact_number = serializers.CharField(required = True)
    address = serializers.CharField(required = True)
    image = serializers.CharField(max_length=100,default='',required = False, allow_null=True)
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'confirm_password', 'contact_number', 'address','image']
    
    def save(self):
        username = self.validated_data['username']
        first_name = self.validated_data['first_name']
        last_name = self.validated_data['last_name']
        email = self.validated_data['email']
        password = self.validated_data['password']
        password2 = self.validated_data['confirm_password']
        contact_number = self.validated_data['contact_number']
        address = self.validated_data['address']
        image = self.validated_data.get('image', None)
        
        if password != password2:
            raise serializers.ValidationError({'error' : "Password Doesn't Mactched"})
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'error' : "Email Already exists"})
        account = User(username = username, email=email, first_name = first_name, last_name = last_name)
        print(account)
        account.set_password(password)
        account.is_active = False
        account.save()

        Customer.objects.create(
            user=account,
            contact_number=contact_number,
            address=address,
            image=image)
        return account

class CustomerLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)
    password = serializers.CharField(required = True)
