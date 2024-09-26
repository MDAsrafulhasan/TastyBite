from django.contrib import admin

# Register your models here.
from .models import FoodOrder
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id','first_name','order_date','order_status','cancel')

    def first_name(self,obj):
        return obj.customer.user.first_name
    

admin.site.register(FoodOrder,OrderAdmin)