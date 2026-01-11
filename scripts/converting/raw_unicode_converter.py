#/usr/bin/env python3
#!encoding=utf-8
# This script converts the Unicode encoding of the file contents in the specified path to UTF-8 characters. It also converts double backslashes to single backslashes.
# usage: python raw_unicode_converter.py <file_path> [other_file_paths...]
# Example:
#   for file `test.md` with content = '\u4e0a\u4e00\u4efd\u62a5\u544a\uff1a20260111-145631\uff0c\u6807\u8bb0\u4e3a complete\uff0c\u662f\u5bf9 TS \u8f6c\u8bd1\u7684\u521d\u6b65\u603b\u7ed3\u548c\u6218\u7565\u5f52\u7ed3\u3002'
#   run: python raw_unicode_converter.py test.md
#   we will get the new `test.md` with content = '上一份报告：20260111-145631，标记为 complete，是对 TS 转译的初步总结和战略归结。'

import os
import sys
import re

RE_UNICODE_SERIES = re.compile(r'\\u([0-9a-fA-F]{4})')
'''unicode正则'''
RE_BACKSLASH = re.compile(r'\\\\')

def convert_content(text: str) -> str:
    '''convert raw content with `\\uXXXX` to UTF-8'''
    def replace_unicode(u_xxxx_series: str):
        code = int(u_xxxx_series, 16)
        return chr(code)
    def replace_unicode_match(match: re.Match):
        return replace_unicode(match.group(1))

    text = RE_UNICODE_SERIES.sub(replace_unicode_match, text)
    text = RE_BACKSLASH.sub(r'\\', text)
    return text

def convert_file(file_path: str, destination_path: str) -> tuple:
    '''input file path, output new content'''
    content = None
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if content is None:
        raise Exception('Cannot read file: ' + file_path)

    new_content = convert_content(content)

    with open(destination_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return content, new_content

def convert(file_path: str, destination_path: str):
    '''convert file and print result'''
    try:
        old_content, new_content = convert_file(file_path, destination_path)
        if old_content == new_content:
            print('No changes made to file: ' + file_path)
        else:
            print('Converted file: ' + file_path)
            print(f'length: {len(old_content)} -> {len(new_content)}')
    except BaseException as e:
        print(f'Error converting file: {file_path}\n{e}')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python raw_unicode_converter.py <file_path>')
        sys.exit(1)
    for file_path in sys.argv[1:]:
        if not os.path.exists(file_path):
            print('File not found: ' + file_path)
            sys.exit(1)
        destination_path = file_path
        convert(file_path, destination_path)
