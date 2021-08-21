import os
import json
from pathlib import Path
from dotenv import load_dotenv 
import django_heroku

load_dotenv() # load environment variables

BASE_DIR = Path(__file__).resolve().parent.parent

SETTINGS_PATH = os.path.dirname(os.path.dirname(__file__))

SECRET_KEY = os.getenv('SECRET_KEY')

ALLOWED_HOSTS = ['127.0.0.1', '.r.appspot.com']

if(os.getenv('DEBUG') == 'false'): # get debug info from env
    DEBUG = False
else:
    DEBUG = True


INSTALLED_APPS = [
    'main',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'paathshala.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(SETTINGS_PATH, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'paathshala.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# load static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') # set static files root
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static/'), # set static dir
)
STATIC_URL = os.path.join(BASE_DIR, '/static/') # set static url

LOGIN_REDIRECT_URL = '/login/' # default login redirect url
LOGIN_URL = '/login/'

#firebase config
FIREBASE_DIR = os.path.join(SETTINGS_PATH, 'paathshala', "firebase_config.json")
with open(FIREBASE_DIR, "r") as f:
    FIREBASE_CONFIG = json.loads(f.read())
    
# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
