# Generated by Django 3.1 on 2020-09-27 19:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0004_auto_20200923_2018'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='position',
            field=models.CharField(max_length=200, verbose_name='event place,  city'),
        ),
    ]
