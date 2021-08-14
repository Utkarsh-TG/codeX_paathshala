import os
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http.response import HttpResponse, JsonResponse
from django.conf import settings

def ignition(request):
    return HttpResponse('Run Successfull!', status='200')

@login_required
def dashboard(request):
    if request.user.is_staff:
        context = {}
        return render(request, 'moderator/dashboard.html', context)
    else:
        return HttpResponse('You are not allowed to view this content!')