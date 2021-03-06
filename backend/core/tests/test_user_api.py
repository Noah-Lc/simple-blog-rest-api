from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

CREAT_USER_URL = reverse('profile:register')
UPDATE_USER_URL = reverse('profile:update')
TOKEN_URL = reverse('profile:login')


def create_user(**params):
    """Function to create a new user"""

    return get_user_model().objects.create_user(**params)


class PublicUserApiTests(TestCase):
    """Test the users API (public)"""

    def setUp(self):
        self.client = APIClient()

    def test_create_valid_user_success(self):
        """Test creating user with a valid parametrs"""

        parametrs = {'email': 'test@noah-lc.com', 'name': 'test', 'password': 'testPASS@123'}
        res = self.client.post(CREAT_USER_URL, parametrs)
        data = {'email': res.data['email'], 'name': res.data['name']}

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(**data)
        self.assertTrue(user.check_password(parametrs['password']))
        self.assertNotIn('password', res.data)

    def test_password_too_short(self):
        """Test if password not short"""

        parametrs = {'email': 'test@noah-lc.com', 'name': 'test', 'password': 'pass'}
        res = self.client.post(CREAT_USER_URL, parametrs)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(email=parametrs['email']).exists()
        self.assertFalse(user_exists)

    def test_create_token_for_user(self):
        """Test that a token is created"""

        parametrs = {'email': 'test@noah-lc.com', 'name': 'test', 'password': 'testPASS@123'}
        create_user(**parametrs)
        res = self.client.post(TOKEN_URL, parametrs)

        self.assertIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_create_token_invalid_credentials(self):
        """Test that token is not created if invalid credentials are given"""

        create_user(email="test@noah-lc.com", name="Test", password="wrongPASS@123")
        parametrs = {'email': 'test@noah-lc.com', 'name': 'test', 'password': 'testPASS@123'}
        res = self.client.post(TOKEN_URL, parametrs)

        self.assertNotIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_token_no_user(self):
        """Test token created if user doesn't exist"""

        parametrs = {'email': 'test@noah-lc.com', 'name': 'test', 'password': 'testPASS@123'}
        res = self.client.post(TOKEN_URL, parametrs)

        self.assertNotIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_token_missing_field(self):
        """Test that email and password are required"""

        parametrs = {'email': 'test', 'name': 'test', 'password': ''}
        res = self.client.post(TOKEN_URL, parametrs)

        self.assertNotIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_user_unauthorized(self):
        """Test that authentication required for user"""

        res = self.client.get(UPDATE_USER_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateUserApiTests(TestCase):
    """Test API requests that require authentication"""
    def setUp(self):
        self.user = create_user(email='test@noah-lc.com', password='testPASS@123', name='test', )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_retrieve_profile_success(self):
        """Test retrieving profile for logged in user"""
        res = self.client.get(UPDATE_USER_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {'pk': self.user.pk, 'email': self.user.email, 'name': self.user.name, 'avatar': None, 'is_staff': self.user.is_staff, 'is_superuser': self.user.is_superuser, 'is_active': self.user.is_active})  # noqa: E501

    def test_post_me_not_allowed(self):
        """Test that POST is not allowed on the me URL"""
        res = self.client.post(UPDATE_USER_URL, {})

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_user_profile(self):
        """Test updating the user profile for authenticated user"""
        payload = {'name': 'new test', 'password': 'newPASS@123'}

        res = self.client.patch(UPDATE_USER_URL, payload)

        self.user.refresh_from_db()
        self.assertEqual(self.user.name, payload['name'])
        self.assertTrue(self.user.check_password(payload['password']))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
