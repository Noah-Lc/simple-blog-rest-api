from django.urls import path, include
from rest_framework.routers import DefaultRouter

from posts import views


router = DefaultRouter()
router.register('tags', views.TagViewSet)

app_name = 'posts'

urlpatterns = [
    path(r'\tags', include(router.urls))
]
