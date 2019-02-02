from django.test import TestCase
from django.contrib.auth import get_user_model

from unittest.mock import patch

from core import models


def sample_user(email='test@noah-lc.com', password='testPASS@123'):
    """Create a sample user"""

    return get_user_model().objects.create_user(email, password)


class ModelTests(TestCase):

    def test_create_user_with_email_successful(self):
        """Test creating a new user with an email is successful"""
        email = 'test@noah-lc.com'
        name = 'Noah Lc'
        password = 'testPASS@123'

        user = get_user_model().objects.create_user(email=email, name=name, password=password)

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        """Test the email for a new user is normalized"""
        email = 'test@NOAH-LC.com'
        user = get_user_model().objects.create_user(email, 'testPASS@123')

        self.assertEqual(user.email, email.lower())

    def test_new_user_invalid_email(self):
        """Test creating user with no email raises error"""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(None, 'testPASS@123')

    def test_new_superuser(self):
        """Test creating a new superuser"""
        user = get_user_model().objects.create_superuser('admin@noah-lc.com', 'adminPASS@123')

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_tag_str(self):
        """Test the tag string representation"""
        tag = models.Tag.objects.create(user=sample_user(), name='Tag')

        self.assertEqual(str(tag), tag.name)

    def test_category_str(self):
        """Test the category string representation"""
        category = models.Category.objects.create(user=sample_user(), name='Cat01')

        self.assertEqual(str(category), category.name)

    def test_post_str(self):
        """Test the post string representation"""
        user = sample_user()
        category = models.Category.objects.create(user=user, name='Cat01')
        recipe = models.Post.objects.create(user=user, title='Test Post', content='Hello World!', category= category,)

        self.assertEqual(str(recipe), recipe.title)

    @patch('uuid.uuid4')
    def test_post_file_name_uuid(self, mock_uuid):
        """Test that image is saved in the correct location"""
        uuid = 'test-uuid'
        mock_uuid.return_value = uuid
        file_path = models.post_image_file_path(None, 'myimage.jpg')

        exp_path = f'uploads/post/{uuid}.jpg'
        self.assertEqual(file_path, exp_path)
