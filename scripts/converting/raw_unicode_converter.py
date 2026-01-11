#/usr/bin/env python3
#!encoding=utf-8
# This script converts the Unicode encoding of the file contents in the specified path to UTF-8 characters. It also converts double backslashes to single backslashes.
# usage: python raw_unicode_converter.py <file_path> [-l|--line <line_number>] [other_file_paths...]
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

def convert_file(file_path: str, destination_path: str, line_number: int = None) -> tuple:
    '''input file path, output new content'''
    content = None
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if content is None:
        raise Exception('Cannot read file: ' + file_path)

    if line_number is not None:
        # 只对指定行进行转换
        lines = content.split('\n')
        if line_number < 1 or line_number > len(lines):
            print(f'Invalid line number: {line_number}')
            return content, content
        content_line = lines[line_number-1]
        new_content_line = convert_content(content_line)
        lines[line_number-1] = new_content_line
        new_content = '\n'.join(lines)
    else:
        new_content = convert_content(content)

    with open(destination_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return content, new_content

def convert(file_path: str, destination_path: str, line_number: int = None):
    '''convert file and print result; none if convert entire file'''
    try:
        old_content, new_content = convert_file(file_path, destination_path, line_number)
        if old_content == new_content:
            print('No changes made to file: ' + file_path)
        else:
            print('Converted file: ' + file_path)
            print(f'    length: {len(old_content)} -> {len(new_content)}')
    except BaseException as e:
        print(f'Error converting file: {file_path}\n{e}')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python raw_unicode_converter.py <file_path> [-l|--line <line_number>] [other_files...]')
        sys.exit(1)

    i = 1
    has_not_found = False
    n_files = 0
    n_success = 0
    n_failed = 0
    while i < len(sys.argv):
        # parse file path and line number
        file_path = sys.argv[i]
        line_number = None
        if i+2 < len(sys.argv):
            next_arg = sys.argv[i+1].strip()
            next_next_arg = sys.argv[i+2].strip()
            try:
                if next_arg == '-l' or next_arg == '--line':
                    # identify -l or --line option
                    line_number = int(next_next_arg)
                i += 2 # use next_arg and next_next_arg
            except:
                pass
        i += 1

        n_files += 1
        if not os.path.exists(file_path):
            print('File not found: ' + file_path)
            has_not_found = True
            n_failed += 1
            continue
        else:
            destination_path = file_path
            try:
                convert(file_path, destination_path, line_number)
                n_success += 1
            except BaseException as e:
                print(f'Error converting file: {file_path}\n{e}')
                n_failed += 1

    print(f'Processed {n_files} files, {n_success} succeeded, {n_failed} failed.')

    if has_not_found:
        sys.exit(1)
