from rest_framework import serializers
from .models import FoodItem,Category

class FoodItemSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(many=True)
    discounted_price = serializers.DecimalField(max_digits=6, decimal_places=2, read_only=True)
    class Meta:
        model = FoodItem
        # fields = '__all__'
        fields = ['name', 'price', 'description', 'category', 'image', 'is_special', 'discount', 'discounted_price']

class CategorySerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField(many=False)
    class Meta:
        model = Category
        fields = '__all__'


# class SpecialFoodItemSerializer(serializers.ModelSerializer):
    
#     class Meta:
#         model = SpecialFoodItem
#         fields = ['name','price','description','category','image', 'discount', 'discounted_price']
#         # fields = '__all__'
