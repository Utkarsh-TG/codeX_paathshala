from django.urls import path
from user import views

urlpatterns = [
    path('ignition/', views.ignition),
    path('', views.dashboard, name='user_dashboard'),
    path('dashboard/', views.dashboard, name='user_dashboard'),
    path('doubts_data/', views.doubts_data, name='doubts_data'),
    path('study_material/', views.study_material, name='study_material'),
    path('firebase_config/', views.firebase_config, name='firebase_config'),
    path('ask_doubt/', views.ask_doubt, name='ask_doubt'),
]