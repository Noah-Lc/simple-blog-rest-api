from core.models import Post, UserProfile, Category, Tag

from django.core.management.base import BaseCommand

import factory


class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post
    user = UserProfile.objects.order_by("?").first()
    title = factory.Faker('word')
    content = factory.Faker('bs')
    category = Category.objects.order_by("?").first()


class Command(BaseCommand):
    help = 'Creates dummy Posts to seed the database'

    def handle(self, *args, **options):
        posts = Post.objects.all()
        if not posts:
            for i in range(12):
                post = PostFactory()
                post.tags.set(Tag.objects.order_by("?")[:2])
                post.save()
            print("Created posts")
        else:
            print("Not creating posts")
