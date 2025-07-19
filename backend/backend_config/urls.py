# c:\Users\user\dealroom_clone\backend\backend_config\urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings # Make sure this is imported
from django.conf.urls.static import static # Make sure this is imported
from django.http import HttpResponse

def home_view(request):
    return HttpResponse("Django Backend is running. API is at /api/")

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Add this for serving media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
