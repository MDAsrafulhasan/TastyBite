# Generated by Django 5.0.4 on 2024-08-25 03:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0005_delete_orderitem'),
    ]

    operations = [
        migrations.DeleteModel(
            name='FoodOrder',
        ),
    ]
