from django.contrib import admin
from django.conf.urls import url
from django.contrib.staticfiles.storage import staticfiles_storage
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path('', include('main.urls')),
    path('user/', include('user.urls')),
    path('moderator/', include('moderator.urls')),
    path('admin/', admin.site.urls),
    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url('images/favicon.ico'))),
]
