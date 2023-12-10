from django.shortcuts import render
from django.conf  import settings
import json
import os
import base64
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.http import JsonResponse, HttpRequest, HttpResponse
from core.models import Activity
from django.core.serializers import serialize

def serialize_activity_with_file(req, activity):
    # Serialize the model excluding the FileField
    serialized_data = serialize('json', [activity], fields=('id', 'owner'))

    serialized_data = json.loads(serialized_data)

    serialized_data[0]['fields']['id'] = activity.id

    file_field_path = activity.activity_file.path

    with open(file_field_path, 'rb') as file:
        file_content = file.read()
        serialized_data[0]['fields']['activity_file'] = base64.b64encode(file_content).decode('ascii')

    return serialized_data[0]['fields']

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)

@login_required
def me(req: HttpRequest):
    return JsonResponse(model_to_dict(req.user))

@login_required
def new_activity(req: HttpRequest):
    user = req.user
    if not req.method == 'POST':
        return HttpResponseNotFound()
    Activity(owner=user, activity_file=req.FILES['activity_file']).save()
    return HttpResponse(status=204)

@login_required
def delete_activity(req: HttpRequest, id):
    user = req.user
    activity = Activity.objects.filter(pk=id, user=user).first()
    if(not activity):
        return HttpResponseNotFound()
    activity.delete()
    return HttpResponse(status=204)

def activities(req: HttpRequest):
    activities = [serialize_activity_with_file(req, activity) for activity in Activity.objects.all()]
    return JsonResponse(activities, safe=False)
    