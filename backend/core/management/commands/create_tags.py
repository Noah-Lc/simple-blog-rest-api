from core.models import UserProfile, Tag
from django.core.management.base import BaseCommand

import factory


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag
    user = UserProfile.objects.order_by("?").first()
    name = factory.Faker('word')


class Command(BaseCommand):
    help = 'Creates dummy Tags to seed the database'

    def handle(self, *args, **options):
        tags = Tag.objects.all()
        if not tags:
            for i in range(5):
                tag = TagFactory()
                tag.save()
            print("Created tags")
        else:
            print("Not creating tags")
