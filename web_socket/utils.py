from .models import Log, Description, Status, Ip
from asgiref.sync import sync_to_async
from prometheus_client import Summary, Gauge
import functools
import psutil
import time
import logging
from channels.db import database_sync_to_async
# import django # django 모듈 전체 임포트가 불필요하다면 제거해도 좋습니다.
# django.setup() # <-- 이 줄을 제거하세요.

TASK_TIME = Summary('time_per_process_task', 'Image prediction time')
USER_COUNT = Gauge('user_count', 'Current using user count')
logger = logging.getLogger("prod")


@database_sync_to_async
def save_log(ip: str, status: int, description: str):
    """로그를 저장하는 함수

    Args:
        ip (str): 아이피 주소
        status (int): 로그 상태
        description (str): 로그의 내용
    """

    description_instance, created = Description.objects.get_or_create(
        description=description)
    if created:
        logger.info(f"새로운 Description 생성: {description}")

    status_instance, created = Status.objects.get_or_create(status=status)
    if created:
        logger.info(f"새로운 Status 생성: {status}")

    ip_instance, created = Ip.objects.get_or_create(ip=ip)
    if created:
        logger.info(f"새로운 Ip 생성: {ip}")

    try:
        Log.objects.create(
            description=description_instance, status=status_instance, ip=ip_instance
        )
        logger.info(
            f"로그 저장 성공: IP={ip}, Status={status}, Description={description}")

    except Exception as e:
        logger.error(f"로그 저장 실패: {e}")


def collect_system_metrics(func):
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        try:
            await func(*args, **kwargs)
        finally:
            duration = time.time() - start
            logger.info(f"Task execution time: {duration:.4f} seconds")
    return wrapper


def collect_user_metrics(func):
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            user_count = await func(*args, **kwargs)
            await sync_to_async(USER_COUNT.set)(user_count)
        except Exception as e:
            logger.error(f"Error in user metrics collection: {e}")
            logger.error('server meltdown or communication error')
    return wrapper
