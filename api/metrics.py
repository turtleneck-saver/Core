# from django_prometheus.exports import ExportMetricClassFactory, register_metric
# from prometheus_client import Gauge

# class CPUUsageGauge(ExportMetricClassFactory(Gauge, 'cpu_usage_percent', 'CPU usage percentage')):
#     pass

# CPU_USAGE = CPUUsageGauge()
# register_metric(CPU_USAGE)

# class MemUsageGauge(ExportMetricClassFactory(Gauge, 'mem_usage_percent', 'Memory usage percentage')):
#     pass

# MEM_USAGE = MemUsageGauge()
# register_metric(MEM_USAGE)

# class HddUsageGauge(ExportMetricClassFactory(Gauge, 'hdd_usage_percent', 'HDD usage percentage')):
#     pass

# HDD_USAGE = HddUsageGauge()
# register_metric(HDD_USAGE)
