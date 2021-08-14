import os
from django.conf import settings
from django.shortcuts import render, redirect
from django.http.response import HttpResponse, JsonResponse
from django.contrib.auth.forms import UserCreationForm
from .forms import CreateUserForm

def ignition(request):
    return HttpResponse('Run Successfull!', status='200')

def home(request):
    return render(request, 'main/home.html')

def signup(request):
    form = CreateUserForm()
    
    if request.method == 'POST':
        form = CreateUserForm(request.POST) # create new user with form input
        if form.is_valid(): # validate form input
            form.save() # save form

    context = {'form':form}
    return render(request, 'main/signup.html', context)

def login(request):
    context = {}
    return render(request, 'main/login.html', context)