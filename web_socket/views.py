# # web_socket/views.py
# from django.http import HttpResponse
# from prometheus_client import generate_latest, CONTENT_TYPE_LATEST, REGISTRY

# def metrics(request):
#     """Prometheus endpoint."""
#     return HttpResponse(generate_latest(REGISTRY), content_type=CONTENT_TYPE_LATEST)
