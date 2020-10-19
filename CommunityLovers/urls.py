
from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from graphql_jwt.decorators import jwt_cookie
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("graphql/", csrf_exempt(jwt_cookie(GraphQLView.as_view(graphiql=True)))),
    re_path(".*",  TemplateView.as_view(template_name="index.html"))
]
## server media files when debug false
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)