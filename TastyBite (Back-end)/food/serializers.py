from rest_framework import serializers
from .models import FoodItem, Category, FavoriteFood

class FoodItemSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(many=True)
    discounted_price = serializers.DecimalField(max_digits=6, decimal_places=2, read_only=True)
    order_count = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()

    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'price', 'description', 'category', 'image', 'is_special', 'discount', 'discounted_price', 'order_count', 'avg_rating', 'rating_count']

    def get_order_count(self, obj):
        from carts.models import CartItems
        return CartItems.objects.filter(fooditem=obj, cart__ordered=True).values('customer').distinct().count()

    def get_avg_rating(self, obj):
        from customer.models import Review
        reviews = Review.objects.filter(food_item=obj)
        if not reviews.exists():
            return 0
        total_stars = sum(len(r.rating) for r in reviews)
        return round(total_stars / reviews.count(), 1)

    def get_rating_count(self, obj):
        from customer.models import Review
        return Review.objects.filter(food_item=obj).count()

class CategorySerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField(many=False)
    class Meta:
        model = Category
        fields = '__all__'

class FavoriteFoodSerializer(serializers.ModelSerializer):
    food_item_details = FoodItemSerializer(source='food_item', read_only=True)

    class Meta:
        model = FavoriteFood
        fields = ['id', 'user', 'food_item', 'food_item_details', 'created_at']


# class SpecialFoodItemSerializer(serializers.ModelSerializer):
    
#     class Meta:
#         model = SpecialFoodItem
#         fields = ['name','price','description','category','image', 'discount', 'discounted_price']
#         # fields = '__all__'
