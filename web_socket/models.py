from django.db import models


class Description(models.Model):
    description = models.TextField()

    def __str__(self):
        return self.description[:50]  # 관리자 페이지에서 보기 좋게


class Status(models.Model):
    status = models.IntegerField()

    def __str__(self):
        return str(self.status)  # 관리자 페이지에서 보기 좋게


class Ip(models.Model):
    ip = models.CharField(max_length=15)

    def __str__(self):
        return self.ip  # 관리자 페이지에서 보기 좋게


class Log(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.ForeignKey(Status, on_delete=models.CASCADE, default=1)
    description = models.ForeignKey(
        Description, on_delete=models.SET_NULL, null=True, blank=True
    )  # null=True, blank=True 추가
    ip = models.ForeignKey(Ip, on_delete=models.SET_NULL, null=True, blank=True)  # null=True, blank=True 추가

    def __str__(self):
        return f"{self.timestamp} - {self.status} - {self.description}"  # 관리자 페이지에서 보기 좋게
