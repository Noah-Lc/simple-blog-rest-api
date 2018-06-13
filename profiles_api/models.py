from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager

# Create your models here.

class UserProfileManager(BaseUserManager):
    """Help Django work with our custom user model."""

    def create_user(self, email, name, password=None):
        """Creates a new user profile object."""

        if not email:
            raise ValueError('Email Adress required')

        email = self.normalize_email(email)
        user = self.model(email=email, name=name)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, name, password=None):
        """Creates a super user profile with given details."""

        user = self.create_user(email, name, password)

        user.is_superuser = True
        user.is_staff = True

        user.save(using=self._db)

        return user


class UserProfile(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserProfileManager();

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def get_short_name(self):
        """Used to get a user name."""

        return self.name

    def __str__(self):
        """Django uses this when it needs to convert the object to a string."""

        return self.email
