from rest_framework import serializers
from .models import FoodOrder

class FoodOrderSerializer(serializers.ModelSerializer):
    # customer = serializers.StringRelatedField(many=False)
    # food_item = serializers.StringRelatedField(many=True)
    class Meta:
        model = FoodOrder
        fields = '__all__'


