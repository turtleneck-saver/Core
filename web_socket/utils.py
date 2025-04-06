
# from .models import Log, Description,Status,Ip
# from channels.db import database_sync_to_async
# import logging
# logger = logging.getLogger("prod")
# @database_sync_to_async
# def save_log(ip: str, status: int, description: str):
    
#     """로그를 저장하는 함수

#     Args:
#         ip (str): 아이피 주소
#         status (int): 로그 상태
#         description (str): 로그의 내용
#     """
    
#     description_instance, created = Description.objects.get_or_create(description=description)
#     if created:
#         logger.info(f"새로운 Description 생성: {description}")

#     status_instance, created = Status.objects.get_or_create(status=status)
#     if created:
#         logger.info(f"새로운 Status 생성: {status}")

#     ip_instance, created = Ip.objects.get_or_create(ip=ip)
#     if created:
#         logger.info(f"새로운 Ip 생성: {ip}")

#     try:
#         Log.objects.create(
#             description=description_instance, status=status_instance, ip=ip_instance
#         )
#         logger.info(f"로그 저장 성공: IP={ip}, Status={status}, Description={description}")

#     except Exception as e:
#         logger.error(f"로그 저장 실패: {e}")
