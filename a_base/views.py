import json
from time import time
from random import randint
from agora_token_builder import RtcTokenBuilder
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import RoomMember


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


@csrf_exempt
def create_member(request):
    data = json.loads(request.body)

    RoomMember.objects.get_or_create(
        name=data["name"], uid=data["UID"], room_name=data["room_name"]
    )

    return JsonResponse({"name": data["name"]}, safe=False)


def get_member(request):
    uid = request.GET.get("UID")
    room_name = request.GET.get("room_name")

    member = RoomMember.objects.get(
        uid=uid,
        room_name=room_name,
    )

    return JsonResponse({"name": member.name}, safe=False)


@csrf_exempt
def delete_member(request):
    data = json.loads(request.body)

    RoomMember.objects.get(
        name=data["name"],
        uid=data["UID"],
        room_name=data["room_name"],
    ).delete()

    return JsonResponse({}, safe=False)
