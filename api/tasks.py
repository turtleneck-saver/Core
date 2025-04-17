from celery import shared_task
import time
import logging
from prometheus_client import Gauge
import psutil

CPU_USAGE = Gauge("cpu_usage_percent", "CPU usage percentage")
MEM_USAGE = Gauge("mem_usage_percent", "Memory usage percentage")
HDD_USAGE = Gauge("hdd_usage_percent", "HDD usage percentage")


@shared_task
def get_resource_metrics():
    try:
        CPU_USAGE.set(psutil.cpu_percent())
        MEM_USAGE.set(psutil.virtual_memory().percent)
        HDD_USAGE.set(psutil.disk_usage("/").percent)
    except Exception as e:
        logging.error(f"Error while getting resource metrics: {e}")
