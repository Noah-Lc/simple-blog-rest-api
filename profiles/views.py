from django.shortcuts import render
from django.contrib.auth import get_user_model

from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.views import ObtainAuthToken

from . import serializers
from . import permissions

# Create your views here.

class UserProfileViewSet(viewsets.ModelViewSet):
    """Handles creating, creating and updating profiles."""

    serializer_class = serializers.UserProfileSerializer
    permission_classes = (permissions.UpdateOwnProfile,)
    authentication_classes = (TokenAuthentication,)

    queryset = get_user_model().objects.all()

class LoginViewSet(viewsets.ViewSet):
    """Check email and password and returns an auth token."""

    serializer_class = AuthTokenSerializer

    def create(self, request):
        """Use the ObtainAuthToken APIview to validate and create a token."""

        return ObtainAuthToken().post(request)
