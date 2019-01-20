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

class PostSerializer(serializers.ModelSerializer):
    """Serialize a post"""
    category = serializers.SlugRelatedField(queryset=Category.objects.all(), slug_field='name')
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all())

    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'image', 'tags', 'category', 'link', 'created_at', 'updated_at',)
        read_only_fields = ('id',)

class PostDetailSerializer(PostSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

class PostImageSerializer(serializers.ModelSerializer):
    """Serializer for uploading images to post"""

    class Meta:
        model = Post
        fields = ('id', 'image')
        read_only_fields = ('id',)
