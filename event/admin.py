from django.contrib import admin
from .models import  Event
# Register your models here.
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    model =Event
    fieldsets  = [
        ("General info", {'fields': ['name', 'slug', 'event_creator', 'position', "is_accepted"]}),
        ("Date and time info", {"fields" : ['start_at', "end_at"]})
        ]