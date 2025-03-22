from celery import shared_task
import time
import logging

logger = logging.getLogger("prod")


@shared_task
def test_task(a: int, b: int):
    for i in range(10):
        time.sleep(2)
        logger.info(f"test Celery task :{a + b} ")
