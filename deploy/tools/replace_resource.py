"""
把 index.html 里的路径全部修改为本地 ./assets/resources/xxx.[js|css] 路径

"""

import re

# HTML 文件路径
html_file_path = '../index.html'  # 替换为你的 HTML 文件路径

# 读取 HTML 文件内容
with open(html_file_path, 'r', encoding='utf-8') as file:
    html_content = file.read()

# 正则表达式匹配所有的 .js 和 .css 链接
pattern = r'(?:href|src)="(?:https?:)?//([^"]+)"'


def local_path_replacer(match):
    # 替换所有匹配的远程链接为本地路径
    url_suffix = match.group(1)
    file_name = url_suffix.split('/')[-1]
    local_path = f'./assets/resources/{file_name}'
    return f'{match.group(0).split("=")[0]}="{local_path}"'


html_content = re.sub(pattern, local_path_replacer, html_content)

# 将修改后的 HTML 内容写回文件
with open(html_file_path, 'w', encoding='utf-8') as file:
    file.write(html_content)

print('All links have been replaced with local paths.')
