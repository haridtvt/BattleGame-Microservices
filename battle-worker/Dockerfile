FROM python:3.9-slim AS builder

LABEL authors="HARI"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /opt/work

COPY requirements.txt .

RUN  pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.9-slim AS runner

WORKDIR /opt/work


COPY --from=builder /install /usr/local

COPY . .

RUN useradd -m haridtvt && chown -R haridtvt /opt/work
USER haridtvt

CMD ["python3", "worker.py"]