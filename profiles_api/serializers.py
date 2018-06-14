from rest_framework import serializers

from . import models

# Create your serializers here.

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for our profile object."""

    class Meta:
        model = models.UserProfile
        fields = ('id', 'email', 'name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """Create and return new user."""

        user = models.UserProfile(
        email=validated_data['email'],
        name=validated_data['name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
