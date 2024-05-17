from rest_framework.views import exception_handler
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        if response.status_code == 404:
            response.data['status_code'] = response.status_code
            response.data['detail'] = 'Usuario o Contraseña incorrecto'
    return response

