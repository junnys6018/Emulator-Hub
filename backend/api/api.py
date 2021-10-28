from django.http import JsonResponse


def get_resource(request):
    return JsonResponse({'data': 'The server says hi! 🐟'})
