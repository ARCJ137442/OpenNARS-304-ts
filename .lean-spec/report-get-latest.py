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
    parsed_reports = [(f, get_report_datetime(f)) for f in reports]
    valid_reports = [item for item in parsed_reports if item[1] is not None]
    if not valid_reports:
        return None
    latest_report, _ = max(valid_reports, key=lambda item: item[1])
    return latest_report

# CLI入口：列出报告有关信息——报告总数、最新报告名称、最新报告时间
if __name__ == "__main__":
    # 总体信息报告
    reports = [f for f in os.listdir(DIR_NAME) if os.path.isfile(os.path.join(DIR_NAME, f))]
    print("Total reports:", len(reports))
    for report in reports:
        date_time = get_report_datetime(report)
        if date_time is not None:
            year, month, day, hour, minute, second = date_time
            print(f"    Report: '{report}'    Time: {year}-{month}-{day} {hour}:{minute}:{second}")
    print()

    # 最新报告
    latest_report = find_latest_report()
    if latest_report is None:
        print("No latest report found.")
    else:
        print("Latest report:", latest_report)
        content = open(os.path.join(DIR_NAME, latest_report), "r", encoding="utf-8").read()
        # 获取报告内的 author，正则表达式提取第一个 author:\s*'([^']*)'
        import re
        author = re.findall(r"author:\s*'([^']*)'", content)[0]
        print("    Author:", author)
        print("    Human Notes:")
        for note in re.findall(r"(?:^|\n)([^【\n]+【(?:[^】]|\n)*】)", content):
            print(f"        {note}")
