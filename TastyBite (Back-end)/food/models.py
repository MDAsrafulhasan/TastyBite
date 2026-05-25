from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=40)
    slug = models.SlugField(max_length=50)
    
    def __str__(self):
        return self.name

class FoodItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField()
    category = models.ManyToManyField(Category)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    is_special = models.BooleanField(default=False)
    image = models.ImageField(upload_to = "food/images/")

    def __str__(self):
        return self.name

    @property
    def discounted_price(self):
        if self.is_special and self.discount > 0:
            return self.price - (self.price * self.discount / 100)
        return self.price

class FavoriteFood(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorite_foods")
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'food_item')

    def __str__(self):
        return f"{self.user.username} favorited {self.food_item.name}"
