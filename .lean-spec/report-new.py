# AGENTS: 用于自动生成新工作报告
# 报告文件夹名称格式：【YYYYMMDD-HHMMSS.md】
# 报告模板文件：report-template.md
# 该脚本总流程：生成最新报告名称，复制模板文件，生成新的空报告文件
import os

## 确保当前工作目录与.lean-spec同级
cwd = os.getcwd()
while not os.path.exists("./.lean-spec") or cwd == "":
    os.chdir("..")
    cwd = os.getcwd()

DIR_NAME = "reports"

## 确保含有报告文件夹：与.lean-spec同级目录下需要有"report"文件夹
if not os.path.exists(DIR_NAME):
    os.mkdir(DIR_NAME)

## 查看最新工作报告名称，按照日期查找
def get_report_datetime(file_name):
    '''需要返回一个可比较的时间格式，解析错误时返回None'''
    datetime_str = file_name.split(" - ")[0].replace(".md", "") # 预留：附加信息

    # 解析日期时间字符串（格式: YYYYMMDD-HHMMSS）
    try:
        date_part, time_part = datetime_str.split("-")
        year, month, day = date_part[:4], date_part[4:6], date_part[6:8]
        hour, minute, second = time_part[:2], time_part[2:4], time_part[4:6]
        return int(year), int(month), int(day), int(hour), int(minute), int(second)
    except:
        return None

def find_latest_report():
    '''查找最新工作报告名称'''
    reports = [f for f in os.listdir(DIR_NAME) if os.path.isfile(os.path.join(DIR_NAME, f))]
    if len(reports) == 0:
        return None
    latest_report = max(reports, key=get_report_datetime)
    return latest_report

## 生成最新报告名称
def generate_report_name(info = None):
    '''生成最新报告名称（无后缀）'''
    import datetime
    now = datetime.datetime.now()
    report_name = now.strftime("%Y%m%d-%H%M%S") + (f' - {info}' if info else "")
    return report_name

## 复制模板文件
def copy_template_file(report_name, author = None):
    '''复制模板文件：创建文件、写入模板内容，替换模板中的占位符
    此时确保cwd在.lean-spec同级目录下
    '''
    import shutil
    template_file = "./.lean-spec/templates/report-template.md"
    report_file = os.path.join(DIR_NAME, report_name + ".md")

    templated_content = ""
    with open(template_file, "r", encoding="utf-8") as f:
        templated_content = f.read()

    # 替换作者
    author = author or "未知作者"
    templated_content = templated_content.replace(f"{{author}}", author)

    # 替换日期
    import datetime
    now = datetime.datetime.now()
    date_str = now.strftime("%Y-%m-%d %H:%M:%S")
    templated_content = templated_content.replace(f"{{date}}", date_str)

    # 替换名称
    templated_content = templated_content.replace(f"{{name}}", report_name)

    # 写入文件
    with open(report_file, "w", encoding="utf-8") as f:
        f.write(templated_content)

# CLI入口：由agent调用时输入自己所属模型（作者）
if __name__ == "__main__":
    # 解析命令行命令：空格后第一个参数为模型名称
    import sys
    model_name = sys.argv[1] if len(sys.argv) > 1 else None
    if model_name:
        print(f"current model: {model_name}")

    # 生成报告文件
    new_report_name = generate_report_name()
    copy_template_file(new_report_name, model_name)
    print(f"new report file generated: {new_report_name}")
