from django.shortcuts import render


def lobby_view(request):
    return render(request, "a_base/lobby.html")


def room_view(request):
    return render(request, "a_base/room.html")
