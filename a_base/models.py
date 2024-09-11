from django.db import models


class RoomMember(models.Model):
    id = models.CharField(max_length=400, primary_key=True)
    room_name = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    uid = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.room_name}: {self.name} - {self.uid}"

    class Meta:
        unique_together = ("room_name", "uid")

    def save(self, *args, **kwargs):
        self.id = f"{self.room_name}-{self.uid}"
        super().save(*args, **kwargs)
