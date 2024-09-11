from time import time
from random import randint
from agora_token_builder import RtcTokenBuilder
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render


def get_token(request):
    channel_name = request.GET.get("channel")
    uid = randint(1, 230)

    token = RtcTokenBuilder.buildTokenWithUid(
        appId=settings.AGORA_APP_ID,
        appCertificate=settings.AGORA_APP_CERTIFICATE,
        channelName=channel_name,
        uid=uid,
        role=1,
        privilegeExpiredTs=int(time()) + settings.AGORA_EXPIRATION_TIME_IN_SECONDS,
    )
    return JsonResponse({"token": token, "uid": uid}, safe=False)


def lobby_view(request):
    return render(request, "a_base/lobby.html")


def room_view(request):
    return render(request, "a_base/room.html")
