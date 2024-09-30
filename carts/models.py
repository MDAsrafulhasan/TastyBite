
from django.db import models
from customer.models import *
from food.models import *
from django.db.models.signals import pre_save,post_save
from django.dispatch import receiver
# Create your models here.
class Cart(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    total_price = models.FloatField(default=0)

    def __str__(self):
        return str(self.customer.user.first_name) + " " + str(self.total_price)
         


class CartItems(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE) 
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    fooditem = models.ForeignKey(FoodItem,on_delete=models.CASCADE)
    price = models.FloatField(default=0)
    quantity = models.IntegerField(default=1)
    
    def __str__(self):
        return str(self.customer.user.first_name) + " " + str(self.fooditem.name)
        
@receiver(pre_save, sender=CartItems)
def correct_price(sender, **kwargs):
    # print(kwargs)
    # print('hi')
    cart_items = kwargs['instance']
    fooditem = FoodItem.objects.get(id=cart_items.fooditem.id)
    cart_items.price = float(cart_items.quantity) * float(fooditem.discounted_price)   #ekhane update korsi
    # cart_items.quantity+=1
    # cart_items.total_items = len(total_cart_items)
    cart = Cart.objects.get(id = cart_items.cart.id)
    cart.total_price += cart_items.price
    # print(cart_items)
    # print(fooditem)
    # print(cart_items.quantity)
    # print(fooditem.discounted_price)
    # print(cart)
    # print(cart_items.price)
    # print(cart.total_price)
    cart.save()
    