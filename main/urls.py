from django.urls import path
from main import views

urlpatterns = [
    path('ignition/', views.ignition),
    path('', views.home),
    path('home/', views.home),
    path('signup/', views.signup),
]