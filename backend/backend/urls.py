from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
from django.urls import path, include,re_path
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('API.urls')),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
