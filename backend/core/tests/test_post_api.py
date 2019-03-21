from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Post, Tag, Category

from blog import utils

from posts.serializers import PostSerializer

import tempfile
import os

from PIL import Image

POSTS_URL = reverse('posts:post-list')


def image_upload_url(post_id):
    """Return URL for post image upload"""
    return reverse('posts:post-upload-image', args=[post_id])


def sample_tag(user, name):
    """Create and return a sample tag"""
    return Tag.objects.create(user=user, name=name)


def detail_url(post_id):
    """Return post detail URL"""
    return reverse('posts:post-detail', args=[post_id])


def sample_category(user, name):
    """Create and return a sample category"""
    return Category.objects.create(user=user, name=name)


def sample_post(user, **params):
    """Create and return a sample post"""
    category = sample_category(user=user, name='Category 1')
    defaults = {'title': 'Sample post', 'content': 'Hello Wolrd again!', 'slug': utils.unique_slug_generator('Sample post'), 'category': category, }  # noqa: E501
    defaults.update(params)

    return Post.objects.create(user=user, **defaults)


class PublicPostApiTests(TestCase):
    """Test unauthenticated post API access"""

    def setUp(self):
        self.client = APIClient()

    def test_not_required_auth(self):
        """Test the authenticaiton is required"""
        res = self.client.get(POSTS_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)


class PrivatePostApiTests(TestCase):
    """Test authenticated post API access"""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user('test@noah-lc.com', 'testPASS@123')
        self.client.force_authenticate(self.user)

    def test_retrieve_posts(self):
        """Test retrieving list of posts"""
        sample_post(user=self.user)
        sample_post(user=self.user)

        res = self.client.get(POSTS_URL)

        posts = Post.objects.all().order_by('id')
        serializer = PostSerializer(posts, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_posts_limited_to_user(self):
        """Test retrieving posts for user"""
        user2 = get_user_model().objects.create_user('admin@noah-lc.com', 'adminPASS@123')
        sample_post(user=user2)
        sample_post(user=self.user)

        res = self.client.get(POSTS_URL, {'user': self.user.id})

        posts = Post.objects.filter(user=self.user)
        serializer = PostSerializer(posts, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(posts), 1)
        self.assertEqual(res.data, serializer.data)

    def test_create_basic_post(self):
        """Test creating post"""
        category = sample_category(user=self.user, name='Category 1')
        payload = {'title': 'Test Post', 'content': 'Hello wolrd!', 'category': category, }
        res = self.client.post(POSTS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        post = Post.objects.get(id=res.data['id'])
        for key in payload.keys():
            self.assertEqual(payload[key], getattr(post, key))

    def test_create_post_with_tags(self):
        """Test creating a post with tags"""
        tag1 = sample_tag(user=self.user, name='Tag 1')
        tag2 = sample_tag(user=self.user, name='Tag 2')
        category = sample_category(user=self.user, name='Category 1')
        payload = {'title': 'Test post with two tags', 'tags': [tag1.id, tag2.id], 'content': 'Hello wolrd!', 'category': category, }
        res = self.client.post(POSTS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        post = Post.objects.get(id=res.data['id'])
        tags = post.tags.all()
        self.assertEqual(tags.count(), 2)
        self.assertIn(tag1, tags)
        self.assertIn(tag2, tags)

    def test_create_post_with_category(self):
        """Test creating post with ingredients"""
        category = sample_category(user=self.user, name='Category 1')
        payload = {'title': 'Test post with category', 'category': category, 'content': 'Hello wolrd!', }

        res = self.client.post(POSTS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        categories = Category.objects.all()
        self.assertEqual(categories.count(), 1)
        self.assertIn(category, categories)

    def test_partial_update_post(self):
        """Test updating a post with patch"""
        post = sample_post(user=self.user)
        post.tags.add(sample_tag(user=self.user, name='tag'))
        new_tag = sample_tag(user=self.user, name='Curry')

        payload = {'title': 'Test Title', 'tags': [new_tag.id]}
        url = detail_url(post.slug)
        self.client.patch(url, payload)

        post.refresh_from_db()
        self.assertEqual(post.title, payload['title'])
        tags = post.tags.all()
        self.assertEqual(len(tags), 1)
        self.assertIn(new_tag, tags)

    def test_full_update_post(self):
        """Test updating a post with put"""
        post = sample_post(user=self.user)
        post.tags.add(sample_tag(user=self.user, name='tag'))
        category = sample_category(user=self.user, name='Category 2')

        payload = {'title': 'Test full post', 'category': category, 'content': 'Hello wolrd!', }
        url = detail_url(post.slug)
        self.client.put(url, payload)

        post.refresh_from_db()
        self.assertEqual(post.title, payload['title'])
        self.assertEqual(post.category, payload['category'])
        self.assertEqual(post.content, payload['content'])
        tags = post.tags.all()
        self.assertEqual(len(tags), 0)

    def test_create_post_with_unique_slug(self):
        """Test creating post with unique slug"""
        post1 = sample_post(user=self.user, title='Post 01')
        post2 = sample_post(user=self.user, title='Post 02')

        serializer1 = PostSerializer(post1)
        serializer2 = PostSerializer(post2)

        self.assertNotEqual(serializer1.data['slug'], serializer2.data['slug'])


class PostImageUploadTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user('test@noah-lc.com', 'testPASS@123')
        self.client.force_authenticate(self.user)
        self.post = sample_post(user=self.user)

    def tearDown(self):
        self.post.image.delete()

    def test_upload_image_to_post(self):
        """Test uploading an image to post"""
        url = image_upload_url(self.post.slug)

        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            res = self.client.post(url, {'image': ntf}, format='multipart')

        self.post.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('image', res.data)
        self.assertTrue(os.path.exists(self.post.image.path))

    def test_upload_image_bad_request(self):
        """Test uploading an invalid image"""
        url = image_upload_url(self.post.slug)
        res = self.client.post(url, {'image': 'notimage'}, format='multipart')

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_filter_posts_by_tags(self):
        """Test returning posts with specific tags"""
        post1 = sample_post(user=self.user, title='Post 01')
        post2 = sample_post(user=self.user, title='Post 02')
        tag1 = sample_tag(user=self.user, name='Tag 01')
        tag2 = sample_tag(user=self.user, name='Tag 02')
        post1.tags.add(tag1)
        post2.tags.add(tag2)
        post3 = sample_post(user=self.user, title='Post 03')

        res = self.client.get(
            POSTS_URL,
            {'tags': '{},{}'.format(tag1.id, tag2.id)}
        )

        serializer1 = PostSerializer(post1)
        serializer2 = PostSerializer(post2)
        serializer3 = PostSerializer(post3)
        self.assertIn(serializer1.data, res.data)
        self.assertIn(serializer2.data, res.data)
        self.assertNotIn(serializer3.data, res.data)

    def test_filter_posts_by_categories(self):
        """Test returning posts with specific category"""
        category01 = sample_category(user=self.user, name='Cat 01')
        category02 = sample_category(user=self.user, name='Cat 02')

        post1 = sample_post(user=self.user, title='Post 01', category=category01)
        post2 = sample_post(user=self.user, title='Post 02', category=category02)
        post3 = sample_post(user=self.user, title='Post 03')

        res = self.client.get(
            POSTS_URL,
            {'categories': '{},{}'.format(category01.id, category02.id)}
        )
        serializer1 = PostSerializer(post1)
        serializer2 = PostSerializer(post2)
        serializer3 = PostSerializer(post3)

        self.assertIn(serializer1.data, res.data)
        self.assertIn(serializer2.data, res.data)
        self.assertNotIn(serializer3.data, res.data)
