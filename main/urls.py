from django.urls import path
from main import views

urlpatterns = [
    path('ignition/', views.ignition),
    path('', views.home),
    path('home/', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.loginUser, name='login'),
    path('logout/', views.logoutUser, name='logout'),
]