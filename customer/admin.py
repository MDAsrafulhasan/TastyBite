from django.contrib import admin

# Register your models here.
from .models import Customer,Review

class CustomerAdmin(admin.ModelAdmin):
    list_display = ('id','first_name','last_name','contact_number' , 'image')

    def first_name(self,obj):
        return obj.user.first_name
    def last_name(self,obj):
        return obj.user.last_name

admin.site.register(Customer,CustomerAdmin)
admin.site.register(Review)