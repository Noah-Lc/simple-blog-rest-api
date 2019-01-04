from rest_framework import serializers

from django.contrib.auth import get_user_model

# Create your serializers here.

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for our profile object."""

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """Create and return new user."""

        return get_user_model().objects.create_user(**validated_data)
