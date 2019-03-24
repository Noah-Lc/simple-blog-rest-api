from django.urls import path, include
from rest_framework.routers import DefaultRouter

from posts import views


router = DefaultRouter()
router.register('tags', views.TagViewSet, 'tags')
router.register('categories', views.CategoryViewSet, 'categories')
router.register('feature', views.PostFeaturedViewSet, 'feature')
router.register('post', views.PostViewSet, 'post')

app_name = 'posts'

urlpatterns = [
    path(r'posts/', include(router.urls))
]
