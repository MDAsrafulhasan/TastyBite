from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()  # eta router
router.register('list', views.CustomerViewset)  # eta router er antena
router.register('review', views.ReviewViewset)  # eta router er antena

urlpatterns = [
    path('', include(router.urls)),
    path('register/',views.CustomerRegistrationViewset.as_view(), name= 'register' ),
    path('login/',views.CustomerLoginApiView.as_view(), name= 'login' ),
    path('logout/',views.CustomerLogoutView.as_view(), name= 'logout' ),
    path('active/<uid64>/<token>/',views.activate,name= 'activate' ),
]