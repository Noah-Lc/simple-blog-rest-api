from django.urls import path, include
from rest_framework.routers import DefaultRouter

from posts import views


router = DefaultRouter()
router.register('tags', views.TagViewSet)
router.register('categories', views.CategoryViewSet)
router.register('post', views.PostViewSet)
router.register('post', views.PostFeaturedViewSet)

app_name = 'posts'

urlpatterns = [
    path(r'posts/', include(router.urls))
]
