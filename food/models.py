from django.db import models

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
