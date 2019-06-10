from rest_framework import serializers

from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import ugettext_lazy as _


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for our profile object."""

    class Meta:
        model = get_user_model()
        fields = ('pk', 'email', 'avatar', 'name', 'password', 'is_staff', 'is_superuser', 'is_active')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 6}}

    def create(self, validated_data):
        """Create and return new user."""

        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update the user and setting the password correctly and return it"""

        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class AuthTokenSerializer(serializers.Serializer):
    """Serializer for user authentication object"""

    email = serializers.CharField()
    password = serializers.CharField(style = {'input_type': 'password'}, trim_whitespace = False)

    def validate(self, attrs):
        """Validate and authentiate the user"""

        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(request = self.context.get('request'), username = email, password = password)

        if not user:
            msg = _('Unable to authenticate with provided credentials.')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user

        return attrs
