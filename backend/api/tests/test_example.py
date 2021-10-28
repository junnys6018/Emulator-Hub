
from django.test import TestCase
from django.urls import reverse
import json


class GetResourceTests(TestCase):
    def test_get_resource(self):
        response = self.client.get(reverse('get-resource'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content), {'data': 'The server says hi! 🐟'})
