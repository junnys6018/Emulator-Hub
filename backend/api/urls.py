from django.urls import path

from . import api

urlpatterns = [
    path('get-resource', api.get_resource, name='get-resource')
]
