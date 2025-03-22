from django.urls import path

from api.views import Test


urlpatterns = [
    path("test", Test.as_view()),
]
