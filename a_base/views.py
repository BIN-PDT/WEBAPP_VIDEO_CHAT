import json
from time import time
from uuid import uuid4
from agora_token_builder import RtcTokenBuilder
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import RoomMember


def get_token(request):
    channel_name = request.GET.get("channel")
    uid = uuid4()

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
        room_name=data["room_name"],
        name=data["name"],
        uid=data["uid"],
    )

    return JsonResponse({"name": data["name"]}, safe=False)


def get_member(request):
    room_name = request.GET.get("room_name")
    uid = request.GET.get("uid")

    member = RoomMember.objects.get(
        room_name=room_name,
        uid=uid,
    )

    return JsonResponse({"name": member.name}, safe=False)


@csrf_exempt
def delete_member(request):
    data = json.loads(request.body)

    RoomMember.objects.filter(
        room_name=data["room_name"],
        name=data["name"],
        uid=data["uid"],
    ).delete()

    return JsonResponse({}, safe=False)
