from rest_framework import serializers

from core.models import Tag, Category


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
