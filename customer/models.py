from django.db import models
from django.contrib.auth.models import User
from food.models import FoodItem

# Create your models here.
class Customer(models.Model):
    user = models.OneToOneField(User , on_delete=models.CASCADE)
    image = models.ImageField(upload_to="customer/images/")
    contact_number = models.CharField(max_length=12)
    address = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
    
STAR_CHOICES = [
    ('⭐','⭐'),
    ('⭐⭐','⭐⭐'),
    ('⭐⭐⭐','⭐⭐⭐'),
    ('⭐⭐⭐⭐','⭐⭐⭐⭐'),
    ('⭐⭐⭐⭐⭐','⭐⭐⭐⭐⭐'),
]
    
class Review(models.Model):
    customer = models.ForeignKey(Customer , on_delete=models.CASCADE)
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    rating = models.CharField(max_length=20,choices=STAR_CHOICES)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.customer.user.first_name} Review on {self.food_item.name}"