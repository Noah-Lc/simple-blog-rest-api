from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Tag, Category, Post

from posts.serializers import TagSerializer


TAGS_URL = reverse('posts:tag-list')


class PublicTagsApiTests(TestCase):
    """Test the TAG API (public)"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):

        res = self.client.post(TAGS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateTagsApiTests(TestCase):
    """Test TAG that require authentication"""

    def setUp(self):
        self.user = get_user_model().objects.create_user('test@noah-lc.com', 'testPASS@123')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_tags(self):
        """Test retrieving tags"""
        Tag.objects.create(user=self.user, name='Tag1')
        Tag.objects.create(user=self.user, name='Tag2')

        res = self.client.get(TAGS_URL)

        tags = Tag.objects.all().order_by('-name')
        serializer = TagSerializer(tags, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_tags_not_limited_to_user(self):
        """Test that tags returned are for authenticated user"""
        user2 = get_user_model().objects.create_user('admin@noah-lc.com', 'adminPASS@123')
        Tag.objects.create(user=user2, name='Tag3')
        tag = Tag.objects.create(user=self.user, name='Tag4')  # noqa: F841

        res = self.client.get(TAGS_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertNotEqual(len(res.data), 1)

    def test_create_tag_successful(self):
        """Test creating a new tag"""
        payload = {'name': 'Tag5'}
        self.client.post(TAGS_URL, payload)

        exists = Tag.objects.filter(user=self.user, name=payload['name']).exists()
        self.assertTrue(exists)

    def test_create_tag_invalid(self):
        """Test creating a new tag with invalid payload"""
        payload = {'name': ''}
        res = self.client.post(TAGS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_tags_assigned_to_posts(self):
        """Test filtering tags by those assigned to posts"""
        tag1 = Tag.objects.create(user=self.user, name='PHP')
        tag2 = Tag.objects.create(user=self.user, name='Pyhton')
        cat1 = Category.objects.create(user=self.user, name='cat1')
        post = Post.objects.create(title='Post PHP', user=self.user, category=cat1)
        post.tags.add(tag1)

        res = self.client.get(TAGS_URL, {'assigned_only': 1})

        serializer1 = TagSerializer(tag1)
        serializer2 = TagSerializer(tag2)

        self.assertIn(serializer1.data, res.data)
        self.assertNotIn(serializer2.data, res.data)
