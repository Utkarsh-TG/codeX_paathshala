import os
from django.conf import settings
from django.shortcuts import render, redirect
from django.http.response import HttpResponse, JsonResponse
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import login_required
from main.models import Study_Material as sm_db # study material data base

def ignition(request):
    return HttpResponse('Run Successfull!', status='200')

@login_required
def dashboard(request):
    context = {}
    return render(request, 'user/dashboard.html', context)

@login_required
def study_material(request):
    if request.method == 'POST' and request.POST.get('dataHeader') == 'study-material':
        filter_data = request.POST.get('filterData')
        data_type = request.POST.get('dataType')

        # filter study material data
        if(data_type == 'class'):
            db_data = sm_db.objects.filter(_class=filter_data)
        elif(data_type == 'subject'):
            db_data = sm_db.objects.filter(subject=filter_data)
        
        data = list(db_data.values())

        return JsonResponse({'study_material':data})

    return redirect(dashboard)