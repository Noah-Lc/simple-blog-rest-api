from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
import os


class Command(BaseCommand):
    help = 'Creates demo users'

    def handle(self, *args, **options):

        User = get_user_model()

        demo_users = [
            {
                "name": "rebecca",
                "email": "rebecca@company.com",
                "is_active": True,
            },
            {
                "name": "williams",
                "email": "williams@company.com",
                "is_active": True,
            },
            {
                "name": "leo",
                "email": "leo@company.com",
                "is_active": True,
            },
            {
                "name": "katherine",
                "email": "katherine@company.com",
                "is_active": True,
            }
        ]

        for user in demo_users:
            try:
                user = User.objects.create_user(
                    user['email'],
                    user['name'],
                    os.getenv('VUE_APP_DEMO_PASSWORD', 'demopwd123'),
                )

                user.save()
                print(f"Created demo user {user.email}.")

            except IntegrityError:
                print(f"Demo user {user['email']} already exists")
