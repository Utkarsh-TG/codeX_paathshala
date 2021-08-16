from django.urls import path
from user import views

urlpatterns = [
    path('ignition/', views.ignition),
    path('', views.dashboard, name='user_dashboard'),
    path('dashboard/', views.dashboard, name='user_dashboard'),
    path('study_material/', views.study_material, name='study_material'),
]