from rest_framework import permissions


class UpdateOwnObjects(permissions.BasePermission):
    """Allow users to edit their own object."""

    def has_object_permission(self, request, view, obj):
        """Check user is trying to edit their own objects."""

        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user.id == request.user.id


class PostOwnObjects(permissions.BasePermission):
    """Allow users to update their own objects."""

    def has_object_permission(self, request, view, obj):
        """Check the user is trying to update their own status."""

        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user.id == request.user.id
