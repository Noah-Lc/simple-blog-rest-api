import random
import string

from django.utils.text import slugify

from core import models

import uuid
import os


def post_image_file_path(instance, filename):
    """Generate file path for new image"""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'

    return os.path.join('uploads/post/', filename)


def random_string_generator(size=10, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def unique_slug_generator(slug, new_slug=None):
    """
    This is for a Django project and it assumes your instance
    has a model with a slug field and a title character (char) field.
    """
    if new_slug is not None:
        unique_slug = new_slug
    else:
        unique_slug = slugify(slug)

    qs_exists = models.Post.objects.filter(slug=unique_slug).exists()
    if qs_exists:
        new_slug = "{slug}-{randstr}".format(slug=unique_slug, randstr=random_string_generator(size=4))
        return unique_slug_generator(slug, new_slug=new_slug)
    return unique_slug
