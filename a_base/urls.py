from django.urls import path
from . import views

urlpatterns = [
    path("", views.lobby_view),
    path("room/", views.room_view),
    path("get_token/", views.get_token),
]
