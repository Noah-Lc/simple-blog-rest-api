from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

CREAT_USER_URL = reverse('profile-list')

def create_user(**params):
    """Function to create a new user"""
    return get_user_model().objects.create_user(**params)

class PublicUserApiTests(TestCase):
    """Test the users API (public)"""

    def setUp(self):
        self.client = APIClient()

    def test_create_valid_user_success(self):
        """Test creating user with a valid parametrs"""

        parametrs = { 'email' : 'test@noah-lc.com', 'name' : 'test', 'password': 'testPASS@123'}
        res = self.client.post(CREAT_USER_URL, parametrs)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(**res.data)
        self.assertTrue(user.check_password(parametrs['password']))
        self.assertNotIn('password', res.data)

    def test_password_too_short(self):
        """Test if password not short"""

        parametrs = {'email' : 'test@noah-lc.com', 'name' : 'test', 'password' : 'pass'}
        res = self.client.post(CREAT_USER_URL, parametrs)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(email=parametrs['email']).exists()
        self.assertFalse(user_exists)
