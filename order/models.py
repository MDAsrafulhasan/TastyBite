from django.db import models
# Create your models here.
from food.models import FoodItem
from customer.models import Customer

ORDER_STATUS = [
    ('Completed', 'Completed'),
    ('Pending', 'Pending'),
]
class FoodOrder(models.Model):                                # ei model ekhn r dorkar nai.cart app diye orderer sob kaj hoye geche.
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    food_item = models.ManyToManyField(FoodItem)
    order_date = models.DateTimeField(auto_now_add=True)
    order_status = models.CharField(choices=ORDER_STATUS, max_length=10,default="Pending")
    cancel = models.BooleanField(default=False)

    def __str__(self):
        return f"Order of {self.customer.user.first_name}"
