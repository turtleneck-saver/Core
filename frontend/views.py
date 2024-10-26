from django.shortcuts import render


def app(request, *args, **kwargs):
    return render(request, "frontend/index.html")
