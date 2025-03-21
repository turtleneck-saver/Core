from django.http import HttpRequest
from rest_framework import views
from rest_framework.response import Response

from api.tasks import test_task


class Test(views.APIView):
    def get(self, request: HttpRequest):
        test_task.delay(2, 5)
        return Response("Celery Task Running")
