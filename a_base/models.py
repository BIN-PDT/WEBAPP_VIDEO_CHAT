from django.db import models


class RoomMember(models.Model):
    room_name = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    uid = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.room_name}: {self.name} - {self.uid}"
