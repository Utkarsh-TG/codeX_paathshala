from django.urls import path
from moderator import views

urlpatterns = [
    path('ignition/', views.ignition),
    path('', views.dashboard),
    path('dashboard/', views.dashboard),
    path('add_practice_resource/', views.add_practice_resource),
]