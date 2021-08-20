import os
from json import dumps, loads
from datetime import datetime
from django.conf import settings
from django.http import response
from django.shortcuts import render, redirect
from django.http.response import HttpResponse, JsonResponse
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import login_required
from main.models import Study_Material as sm_db # study material data base
from main.models import Practice_Material as pm_db # practice material data base
from main.models import Doubt as doubts_db # doubts data base

config = settings.FIREBASE_CONFIG # read firebase config

def ignition(request):
    return HttpResponse('Run Successfull!', status='200')

@login_required
def dashboard(request):
    context = {}
    return render(request, 'user/dashboard.html', context)

@login_required
def firebase_config(request):
    if request.method == 'POST':
        return JsonResponse({'firebase_config':dumps(config)})

    return redirect(dashboard)

@login_required
def doubts_data(request):
    if request.method == 'POST':
        doubts_data = doubts_db.objects.all()  # get all doubts data

        data_list = list(doubts_data.values())

        user_doubts = doubts_db.objects.filter(user=request.user)  # get user doubts
        user_doubts_list = list(user_doubts.values())

        return JsonResponse({'doubts_data':data_list, 'user_doubts':user_doubts_list})
    
    return redirect(dashboard)
    
@login_required
def study_material(request):
    if request.method == 'POST' and request.POST.get('dataHeader', False) == 'study-material':
        filter_data = request.POST.get('filterData', False)
        data_type = request.POST.get('dataType', False)

        # filter study material data
        if(data_type == 'class'):
            db_data = sm_db.objects.filter(_class=filter_data)
        elif(data_type == 'subject'):
            db_data = sm_db.objects.filter(subject=filter_data)
        
        # make list with filtered values
        data = list(db_data.values())

        return JsonResponse({'study_material':data})
    
    elif request.method == 'POST' and request.POST.get('dataHeader', False) == 'practice-material':
        filter_data = request.POST.get('filterData', False)
        data_type = request.POST.get('dataType', False)

        # filter practice material data
        if(data_type == 'class'):
            db_data = pm_db.objects.filter(_class=filter_data)
        elif(data_type == 'subject'):
            db_data = pm_db.objects.filter(subject=filter_data)
        
        data = list(db_data.values())

        return JsonResponse({'practice_material':data})

    return redirect(dashboard)

@login_required
def ask_doubt(request):
    if request.method == 'POST':
        user = request.user
        content = request.POST.get('content', False)  # get html question content
        tags = request.POST.get('tags', False)
        questionID = request.POST.get('id', False)
        
        date_time = datetime.utcnow() # get current date and time in UTC

        doubtsDB = doubts_db(user=user, content=content, tags=tags, responses=[], votes=[], _id=questionID, date=date_time)

        doubtsDB.save()

        return HttpResponse('')

    return redirect(dashboard)