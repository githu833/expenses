from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_transaction, name='add_transaction'),
    path('history/', views.get_history, name='get_history'),
    path('summary/', views.get_summary, name='get_summary'),
]
