from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('new_activity/', view=views.new_activity),
    path('delete_activity/', view=views.delete_activity),
    path('activities/', view=views.activities),
    path('me/', views.me)
]