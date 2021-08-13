from django.contrib import admin
from django.conf.urls import url
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path('', include('main.urls')),
    path('user/', include('user.urls')),
    path('moderator/', include('moderator.urls')),
    path('admin/', admin.site.urls),
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/images/favicon.ico')),
]
