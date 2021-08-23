import os
from django.conf import settings
from django.contrib import messages
from django.shortcuts import render, redirect
from django.http.response import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from .forms import CreateUserForm
from user import views as userViews
from moderator import views as moderatorViews

def ignition(request):
    return HttpResponse('Run Successfull!', status='200')

def home(request):
    if request.user.is_authenticated:
        return redirect(userViews.dashboard)
    else:
        return render(request, 'main/home.html')

def signup(request):
    if request.user.is_authenticated:
        return redirect(userViews.dashboard)
    else:
        if request.method == 'POST':
            form = CreateUserForm(request.POST)  # create new user with form input
            if form.is_valid():  # validate form input
                form.save()
                user = form.cleaned_data.get('username')
                #messages.success(request, 'Succesfully created account for '+ user)
                return redirect(loginUser)  # redirect to login
            else:
                # invalid signup credentials
                context = {'form':form}
                # return form errors
                return render(request, 'main/signup.html', context)

    form = CreateUserForm()
    context = {'form':form}
    return render(request, 'main/signup.html', context)

def loginUser(request):
    if request.user.is_authenticated:
        return redirect(userViews.dashboard)
    else:
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')

            user = authenticate(request, username=username, password=password)  # authenticate user

            if user is not None:
                login(request, user)
                if request.user.is_staff:
                    return redirect(moderatorViews.dashboard) # redirect to moderator dashboard
                else:    
                    return redirect(userViews.dashboard) # redirect to user dashboard
            else:
                # invalid login credentials
                messages.info(request, 'Username or Password is incorrect!') # message error
                context = {}
                return render(request, 'main/login.html', context) # render login page

        context = {}
        return render(request, 'main/login.html', context)

def logoutUser(request):
    logout(request)
    return redirect(loginUser)