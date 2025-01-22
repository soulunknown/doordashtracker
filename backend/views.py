from django.http import HttpResponse

def home_view(request):
    return HttpResponse("<h1>Welcome to the Tracking App API</h1>")
