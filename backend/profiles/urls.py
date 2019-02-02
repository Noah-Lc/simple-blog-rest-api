from django.conf.urls import url

from . import views

app_name = 'profile'

urlpatterns = [
    url(r'profile', views.UserProfileViewSet.as_view(), name='profile'),
    url(r'login', views.LoginViewSet.as_view(), name='login'),
    url(r'update', views.ManagerUserProfileViewSet.as_view(), name='update')
]
