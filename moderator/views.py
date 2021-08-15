import os
import json
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http.response import HttpResponse, JsonResponse
from django.conf import settings
from main.models import Study_Material as sm_db # study material data base
from main.models import Practice_Material as pm_db # practice material data base
import pyrebase

config = settings.FIREBASE_CONFIG # import firebase config

firebase = pyrebase.initialize_app(config) # initialize firebase app

storage = firebase.storage() # initialize firebase storage bucket

def ignition(request):
    return HttpResponse('Run Successfull!', status='200')

@login_required
def dashboard(request):
    if request.user.is_staff:
        if request.method == 'POST' and request.FILES['resource-file'] and request.POST.get('form-title') == 'add_resource_material':
            # get form values
            resource_title = request.POST.get('resource-title', False)
            resource_class = request.POST.get('resource-class', False)
            resource_subject = request.POST.get('resource-subject', False)
            resource_file = request.FILES['resource-file']
            resource_description = request.POST.get('resource-description', False)

            if resource_title and resource_class and resource_subject and resource_description:
                file_name = resource_file.name # get file name
                
                # file cloud storage ref
                storageRef = storage.child('Resources/' + resource_class + '/' + resource_subject + '/' + resource_title + '/' + file_name)

                storageRef.put(resource_file) # store file in storage ref

                uploaded_file_url = storage.child('Resources/' + resource_class + '/' + resource_subject + '/'+resource_title+'/'+file_name).get_url('token') 
                # get file url from ref

                date_time = datetime.utcnow() # get current date and time in UTC

                resource_mat = sm_db(_class=resource_class, subject=resource_subject, title=resource_title, description=resource_description, url=uploaded_file_url, date=date_time) # create study material model instance

                resource_mat.save() # save resource config 

                context = {}
                return render(request, 'moderator/dashboard.html', context)

        context = {}
        return render(request, 'moderator/dashboard.html', context)

    else:
        return HttpResponse('You are not allowed to view this content!')

@login_required
def add_practice_resource(request):
    if request.user.is_staff:
        if request.method == 'POST':
            resource_title = request.POST.get('title', False)
            resource_class = request.POST.get('class', False)
            resource_subject = request.POST.get('subject', False)
            resource_description = request.POST.get('description', False)
            resource_questions = request.POST.get('questions', False)

            date_time = datetime.utcnow() # get current date and time in UTC
            
            resource_mat = pm_db(_class=resource_class, subject=resource_subject, title=resource_title, description=resource_description, questions=json.loads(resource_questions), date=date_time) # create practice material model instance

            resource_mat.save() # save resource config 
            
            context = {}
            return render(request, 'moderator/dashboard.html', context)
        
        context = {}
        return render(request, 'moderator/dashboard.html', context)

    else:
        return HttpResponse('You are not allowed to view this content!')