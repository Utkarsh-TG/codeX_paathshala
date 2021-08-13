from django.urls import path
from moderator import views

urlpatterns = [
    path('ignition/', views.ignition),
]