import os

import subprocess


def format_code(file_path):
    try:
        # autopep8 명령어 실행
        subprocess.run(['autopep8', '--in-place', '--max-line-length=120', file_path], check=True)
        print(f"{file_path}가 포맷팅되었습니다.")
    except subprocess.CalledProcessError as e:
        print(f"오류 발생: {e}")


def scan_directory(directory):
    # 지정한 디렉터리의 모든 파일 및 서브디렉터리를 스캔
    for root, _, files in os.walk(directory):
        for file in files:
            if file[-3:] == '.py':
                format_code(os.path.join(root, file))



directory_path = '/app/'  # 스캔할 디렉터리 경로
scan_directory(directory_path)
