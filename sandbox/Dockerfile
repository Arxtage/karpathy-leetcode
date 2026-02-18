FROM python:3.11-slim

RUN pip install --no-cache-dir \
    torch --index-url https://download.pytorch.org/whl/cpu \
    numpy

USER nobody
WORKDIR /tmp
