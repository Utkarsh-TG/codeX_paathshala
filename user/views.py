import os
from django.shortcuts import render, redirect
from django.http.response import HttpResponse, JsonResponse
from django.conf import settings

def ignition(request):
    return HttpResponse('Run Successfull!', status='200')