from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Category, Post

from posts.serializers import CategorySerializer

CATEGORIES_URL = reverse('posts:category-list')


class PublicCategorysApiTests(TestCase):
    """Test the Category API (public)"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):

        res = self.client.post(CATEGORIES_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateCategorysApiTests(TestCase):
    """Test Category that require authentication"""

    def setUp(self):
        self.user = get_user_model().objects.create_user('test@noah-lc.com', 'testPASS@123')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_Categories(self):
        """Test retrieving Categories"""
        Category.objects.create(user=self.user, name='Cat01')
        Category.objects.create(user=self.user, name='Cat02')

        res = self.client.get(CATEGORIES_URL)

        Categorie = Category.objects.all().order_by('-name')
        serializer = CategorySerializer(Categorie, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_categories_limited_to_user(self):
        """Test that Categories returned are for authenticated user"""
        user2 = get_user_model().objects.create_user('admin@noah-lc.com', 'adminPASS@123')
        Category.objects.create(user=user2, name='Cat03')
        Cat = Category.objects.create(user=self.user, name='Cat04')

        res = self.client.get(CATEGORIES_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['name'], Cat.name)

    def test_create_category_successful(self):
        """Test creating a new category"""
        payload = {'name': 'Cat5'}
        self.client.post(CATEGORIES_URL, payload)

        exists = Category.objects.filter(user=self.user, name=payload['name']).exists()
        self.assertTrue(exists)

    def test_create_category_invalid(self):
        """Test creating a new category with invalid payload"""
        payload = {'name': ''}
        res = self.client.post(CATEGORIES_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_categories_assigned_to_posts(self):
        """Test filtering categories by those assigned to posts"""
        cat01 = Category.objects.create(user=self.user, name='Unity')
        cat02 = Category.objects.create(user=self.user, name='Unreal')
        cat03 = Category.objects.create(user=self.user, name='DevX')  # noqa: F841

        post = Post.objects.create(user=self.user, title='Test Post', content='Hello World!', category= cat01,)  # noqa: F841
        res = self.client.get(CATEGORIES_URL, {'assigned_only': 1})

        serializer1 = CategorySerializer(cat01)
        serializer2 = CategorySerializer(cat02)
        self.assertIn(serializer1.data, res.data)
        self.assertNotIn(serializer2.data, res.data)
