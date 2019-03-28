from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from django.core.files import File
import os


class Command(BaseCommand):
    help = 'Creates demo users'

    def handle(self, *args, **options):

        User = get_user_model()

        avatars = ["avatar01.png", "avatar02.png", "avatar03.png", "avatar04.png"]

        demo_users = [
            {
                "name": "rebecca",
                "email": "rebecca@company.com",
                "avatar": avatars[0],
                "is_active": True,
            },
            {
                "name": "williams",
                "email": "williams@company.com",
                "avatar": avatars[1],
                "is_active": True,
            },
            {
                "name": "leo",
                "email": "leo@company.com",
                "avatar": avatars[2],
                "is_active": True,
            },
            {
                "name": "katherine",
                "email": "katherine@company.com",
                "avatar": avatars[3],
                "is_active": True,
            }
        ]

        for demo_user in demo_users:
            try:
                user = User.objects.create_user(
                    demo_user['email'],
                    demo_user['name'],
                    os.getenv('VUE_APP_DEMO_PASSWORD', 'demopwd123'),
                )

                avatar = open(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'img', demo_user['avatar'])), "rb")  # noqa: E501

                django_file = File(avatar)

                user.avatar.save(demo_user['avatar'], django_file, save=True)

                user.save()
                print(f"Created demo user {user.email}.")

            except IntegrityError:
                print(f"Demo user {demo_user['email']} already exists")
