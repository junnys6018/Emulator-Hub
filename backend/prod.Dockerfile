FROM python:3.8-slim
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y libpq-dev gcc
RUN pip install --upgrade pip

RUN pip install gunicorn

WORKDIR /code/backend

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]