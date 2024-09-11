from django.urls import path
from . import views

urlpatterns = [
    path("", views.lobby_view),
    path("room/", views.room_view),
    path("get_token/", views.get_token),
    path("create_member/", views.create_member),
    path("get_member/", views.get_member),
    path("delete_member/", views.delete_member),
]
