from django.contrib import admin
from .models import Category,FoodItem
# Register your models here.

class CategorySlugAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',),}

class FoodItemAdmin(admin.ModelAdmin):
    list_display = ('id','name','price')

admin.site.register(Category,CategorySlugAdmin)
admin.site.register(FoodItem,FoodItemAdmin)
# admin.site.register(SpecialFoodItem)