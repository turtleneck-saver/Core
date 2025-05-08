import django
django.setup()
import time
import psutil
import logging
import os
from celery import shared_task
from prometheus_client import Gauge, push_to_gateway, CollectorRegistry
import socket  # 호스트 이름 가져오기

logger = logging.getLogger("prod")

# 인스턴스 ID 가져오기 (환경 변수에서, 없으면 호스트 이름 사용)
INSTANCE_ID = os.environ.get('INSTANCE_ID', socket.gethostname())

# 메트릭 레지스트리 생성
registry = CollectorRegistry()

# Gauge 메트릭 생성 및 등록 (인스턴스 레이블 추가)
CPU_USAGE = Gauge('cpu_usage_percent', 'CPU usage percentage', ['instance'], registry=registry)
MEM_USAGE = Gauge('mem_usage_percent', 'Memory usage percentage', ['instance'], registry=registry)
HDD_USAGE = Gauge('hdd_usage_percent', 'HDD usage percentage', ['instance'], registry=registry)

# Pushgateway 주소 설정 (환경 변수에서, 없으면 기본값 사용)
PUSHGATEWAY_ADDRESS = os.environ.get('PUSHGATEWAY_ADDRESS', '127.0.0.1:9091')

@shared_task
def test_task():
    try:
        cpu_usage = psutil.cpu_percent()
        CPU_USAGE.labels(instance=INSTANCE_ID).set(cpu_usage)  # 인스턴스 레이블 설정

        mem_usage = psutil.virtual_memory().percent
        MEM_USAGE.labels(instance=INSTANCE_ID).set(mem_usage)  # 인스턴스 레이블 설정

        hdd_usage = psutil.disk_usage('/').percent
        HDD_USAGE.labels(instance=INSTANCE_ID).set(hdd_usage)  # 인스턴스 레이블 설정

    except Exception as e:
        logger.error(f"메트릭 설정 중 오류 발생: {e}")
    finally:
        # Push metrics to Pushgateway
        try:
            push_to_gateway(PUSHGATEWAY_ADDRESS, job='celery_tasks', registry=registry)
            logger.info(f"Prometheus metrics pushed to Pushgateway for instance {INSTANCE_ID}")
        except Exception as e:
            logger.error(f"Pushgateway에 메트릭 푸시 중 오류 발생: {e}")
