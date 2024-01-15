"""
把 index.html 里的路径全部修改为本地 downloaded_resources 路径下

"""

import os
import re

import requests

# HTML 文件路径
html_file_path = '../index.html'  # 替换为你的 HTML 文件路径

# 确保下载目录存在
download_dir = '../assets/resources'
if not os.path.exists(download_dir):
    os.makedirs(download_dir)

# 读取 HTML 文件内容
with open(html_file_path, 'r', encoding='utf-8') as file:
    html_content = file.read()

# 正则表达式匹配所有的 .js 和 .css 链接
pattern = r'(?:href|src)="(?:https?:)?\/\/([^"]+)"'
matches = re.findall(pattern, html_content)

# 下载每个匹配的文件
for url_suffix in matches:
    # 构建完整的 URL
    url = f'https://{url_suffix}'
    # 提取文件名
    file_name = url_suffix.split('/')[-1]
    # 完整的本地文件路径
    local_file_path = os.path.join(download_dir, file_name)

    # 发送请求并保存文件
    print(f'Downloading {url}...')
    response = requests.get(url)
    if response.status_code == 200:
        with open(local_file_path, 'wb') as file:
            file.write(response.content)
        print(f'Saved to {local_file_path}')
    else:
        print(f'Failed to download {url}')

print('Download completed.')
