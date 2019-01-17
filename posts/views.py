from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Tag, Category, Post

from posts import serializers


class BasePostsAttrViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin):
    """Base viewset for user owned post attributes"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """Return objects for the current authenticated user only"""
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Create a new object"""
        serializer.save(user=self.request.user)

class TagViewSet(BasePostsAttrViewSet):
    """Manage tags in the database"""
    queryset = Tag.objects.all()
    serializer_class = serializers.TagSerializer


class CategoryViewSet(BasePostsAttrViewSet):
    """Manage category in the database"""
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer

class PostViewSet(BasePostsAttrViewSet):
    """Manage posts in the database"""
    serializer_class = serializers.PostSerializer
    queryset = Post.objects.all()
