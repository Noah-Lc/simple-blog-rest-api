from core.models import Post, UserProfile, Category, Tag

from django.core.files import File
from django.core.management.base import BaseCommand

import os

import factory


class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post
    user = UserProfile.objects.order_by("?").first()
    title = factory.Faker('word')
    content = factory.Faker('text')
    category = Category.objects.order_by("?").first()


class Command(BaseCommand):
    help = 'Creates dummy Posts to seed the database'

    def handle(self, *args, **options):

        posts = Post.objects.all()

        images = ["port01.jpg", "port02.jpg", "port03.jpg", "port04.jpg", "port05.jpg", "port06.jpg", "port01.jpg", "port02.jpg", "port03.jpg", "port04.jpg", "port05.jpg", "port06.jpg"]  # noqa: E501

        if not posts:
            for i in range(12):
                post = PostFactory()
                avatar = open(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'img', images[i])), "rb")  # noqa: E501

                django_file = File(avatar)

                post.image.save(images[i], django_file, save=True)
                post.tags.set(Tag.objects.order_by("?")[:2])
                post.save()
            print("Created posts")
        else:
            print("Not creating posts")
