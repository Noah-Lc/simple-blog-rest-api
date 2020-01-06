
import base64

from django.core.files.base import ContentFile
from rest_framework import serializers

from core.models import Tag, Category, Post


class TagSerializer(serializers.ModelSerializer):
    """Serializer for tag object"""

    class Meta:
        model = Tag
        fields = ('id', 'name')
        read_only_Fields = ('id',)


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for an category object"""

    class Meta:
        model = Category
        fields = ('id', 'name')
        read_only_fields = ('id',)


class Base64ImageField(serializers.ImageField):
    def from_native(self, data):
        if isinstance(data, basestring) and data.startswith('data:image'):
            # base64 encoded image - decode
            format, imgstr = data.split(';base64,')  # format ~= data:image/X,
            ext = format.split('/')[-1]  # guess file extension

            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)

        return super(Base64ImageField, self).from_native(data)


class PostSerializer(serializers.ModelSerializer):
    """Serialize a post"""
    image = Base64ImageField(max_length=None, use_url=True, required=False)
    category = serializers.SlugRelatedField(queryset=Category.objects.all(), slug_field='name')
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all())
    created_by = serializers.CharField(source='user.get_short_name', read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'created_by', 'title', 'content', 'image', 'tags', 'category', 'slug', 'created_at', 'updated_at',)
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'},
            'slug': {'read_only': True},
        }


class PostImageSerializer(serializers.ModelSerializer):
    """Serializer for uploading images to post"""

    class Meta:
        model = Post
        fields = ('id', 'image')
        read_only_fields = ('id',)
