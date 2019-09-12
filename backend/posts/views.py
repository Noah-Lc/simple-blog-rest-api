from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, mixins, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.models import Tag, Category, Post
from core.permissions import PostOwnObjects, UpdateOwnObjects

from posts import serializers

from blog import utils


class BasePostsAttrViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin):
    """Base viewset for user owned post attributes"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (PostOwnObjects, IsAuthenticatedOrReadOnly)

    def get_queryset(self):
        """Return objects for current user"""
        assigned_only = bool(self.request.query_params.get('assigned_only'))
        queryset = self.queryset
        if assigned_only:
            queryset = queryset.filter(post__isnull=False)

        return queryset.order_by('-name')

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


class PostViewSet(viewsets.ModelViewSet):
    """Manage posts in the database"""
    serializer_class = serializers.PostSerializer
    lookup_field = 'slug'
    authentication_classes = (TokenAuthentication,)
    permission_classes = (PostOwnObjects, UpdateOwnObjects, IsAuthenticatedOrReadOnly,)
    queryset = Post.objects.all()

    filter_backends = (filters.SearchFilter,)
    search_fields = ('title', 'tags__text')

    def _params_to_ints(self, qs):
        """Convert a list of string IDs to a list of integers"""
        return [int(str_id) for str_id in qs.split(',')]

    def get_queryset(self):
        """Retrieve the posts for the authenticated user"""
        tags = self.request.query_params.get('tags')
        categories = self.request.query_params.get('categories')
        user = self.request.query_params.get('user')
        queryset = self.queryset
        if tags:
            tag_ids = self._params_to_ints(tags)
            queryset = queryset.filter(tags__id__in=tag_ids)
        if categories:
            category_ids = self._params_to_ints(categories)
            queryset = queryset.filter(category__id__in=category_ids)
        if user:
            queryset = queryset.filter(user=user)

        return queryset.all()

    def get_serializer_class(self):
        if self.action == 'upload_image':
            return serializers.PostImageSerializer
        return self.serializer_class

    def perform_create(self, serializer):
        """Create a new post"""
        serializer.save(slug=utils.unique_slug_generator(serializer.validated_data['title']), user=self.request.user)

    @action(methods=['POST'], detail=True, url_path='upload-image')
    def upload_image(self, request, slug):
        """Upload an image to a post"""
        post = self.get_object()
        serializer = self.get_serializer(post, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostFeaturedViewSet(viewsets.ModelViewSet):
    """Reading featured products"""

    serializer_class = serializers.PostSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (PostOwnObjects, UpdateOwnObjects, IsAuthenticatedOrReadOnly,)

    queryset = Post.objects.featured()
