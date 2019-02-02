# simple-blog-rest-api
Create a Simple Blog REST API with Python, Django REST Framework and Docker using Test Driven Development (TDD)

## Technologies used
* [Django](https://www.djangoproject.com/): The web framework for perfectionists with deadlines (Django builds better web apps with less code).
* [REST framework](https://www.django-rest-framework.org/): A powerful and flexible toolkit for building Web APIs.


## Installation
### `docker-compose up -d`

This will build and run the db and simple-blog-api containers.<br>
You now have a simple-blog-api container and PostgreSQL container running on your host.<br>
You can now access the file api service on your browser by using [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)


### `docker-compose run app sh -c "python manage.py test"`

To Run the tests.<br>
By default the tests will individually report only on test failures, followed by a test summary.<br>
See the section about [running tests](https://www.django-rest-framework.org/api-guide/testing/) for more information.


### `docker-compose down`

Stop and remove containers, networks, images, and volumes.<br>
