#!/bin/sh

cd backend

python manage.py wait_for_db
python manage.py makemigrations
python manage.py migrate
python manage.py create_default_user
python manage.py create_demo_users
python manage.py create_tags
python manage.py create_categories
python manage.py create_posts
python manage.py runserver 0.0.0.0:8000
