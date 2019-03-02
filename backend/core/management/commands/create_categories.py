from core.models import UserProfile, Category
from django.core.management.base import BaseCommand

import factory


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category
    user = UserProfile.objects.order_by("?").first()
    name = factory.Faker('word')


class Command(BaseCommand):
    help = 'Creates dummy categories to seed the database'

    def handle(self, *args, **options):
        categories = Category.objects.all()
        if not categories:
            for i in range(4):
                category = CategoryFactory()
                category.save()
            print("Created categories")
        else:
            print("Not creating categories")
