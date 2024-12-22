import time
import json
from flask import Flask, render_template, request, session, jsonify
# import random
import os
from grade import Grade


app = Flask(__name__ , template_folder='./templates')
app.secret_key = os.urandom(24)  # 设置 session 密钥



inquireUrl="https://jwxt.cumtb.edu.cn/eams-micro-server/api/v1/grade/student/grades"

tokenApiUrl = "http://cumtb_api:5000/api/token"
# tokenApiUrl = "http://localhost:5000/api/token"

def error_dict(detail):
    text = {"error": [{"courseCode": "0", "courseNameZh": "错误！", "credits": 0, "finalGrade": "0", "gp": 0, "gradeDetail": detail, "lessonCode": "0"}]}
    return text

def score_inquiry(id , pwd):
    # 学号和生成时间
    info = {"id" : id , "update_time" : time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())}
    header = {"user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36"}
    global grade
    grade = None
    # generate gradeEntry
    try:
        dataDict = Grade.get_token(tokenApiUrl , id , pwd)
    except:
        # 密码输入错误导致不能获取
        grade = error_dict("你的密码可能输入错误，或尝试登录一次教务系统，或联系管理员")
    else:
        header["X-Id-Token"] = dataDict["token"]
        gradeEntry = Grade(header=header , url=inquireUrl , id=id , pwd=pwd , api=tokenApiUrl)
        if gradeEntry.fetch():
                # print("tokenRight!")
            grade =  gradeEntry.get_useful_info()
            # gradeEntry.save_to_file("static/grade.json")
        else:   # 未知原因导致不能获取数据
            grade = error_dict("未知错误原因，请联系管理员")

    return grade , info

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # 获取表单数据
        student_id = request.form.get('student_id')
        password = request.form.get('password')

        # 使用获得的学号和密码查询成绩并展示
        gradeData , info = score_inquiry(student_id , password)

        session['grade_data'] = gradeData
        session['info'] = info

        # 设置一个 session 标志
        session['form_submitted'] = True

        # 返回 HTML 页面，并通过 JavaScript 执行某个操作
        return render_template('index.html', js_execution=True)

    return render_template('index.html', js_execution=False)

@app.before_request
def check_session():
    if session.get('form_submitted', False):
        # 会话结束时执行第二个函数
        # clean_grade_info_file()
        session.pop('form_submitted', None)  # 清除 session

@app.route('/grade_data')
def gradeData():
    # 如果用户没有登录，则返回一个错误消息
    if 'grade_data' not in session:
        return jsonify({"error": "User not logged in"}), 401
    return jsonify(session['grade_data'])

@app.route('/info')
def infoData():
    # 如果用户没有登录，则返回一个错误消息
    if 'info' not in session:
        return jsonify({"error": "User not logged in"}), 401
    return jsonify(session['info'])

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80 , threaded=True)
