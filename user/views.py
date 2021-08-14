import os
from django.conf import settings
from django.shortcuts import render, redirect
from django.http.response import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required

def ignition(request):
    return HttpResponse('Run Successfull!', status='200')

@login_required
def dashboard(request):
    context = {}
    return render(request, 'user/dashboard.html', context)