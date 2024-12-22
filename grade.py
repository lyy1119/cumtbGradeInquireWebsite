import requests
import re
import json
from sort_semester import sort_dict
import urllib.parse

class Grade:
    @staticmethod
    def copy_items(fromDir:dict , itemsToCopy:list):
        singleCourseGrade = {}
        for i in itemsToCopy:
            singleCourseGrade[i] = fromDir[i]
        return singleCourseGrade

    @staticmethod
    def get_token(api , id , pwd):
        id = urllib.parse.quote(id ,  safe='')
        pwd = urllib.parse.quote(pwd ,  safe='')
        url = f"{api}?id={id}&pwd={pwd}"
        response = requests.get(url)
        rawStr = response.text
        dataJson = json.loads(rawStr)
        return dataJson
    
    @staticmethod
    def list_diff(bigList , smallList):
        res = []
        for i in bigList:
            NotFoundInOldList = True
            for j in smallList:
                if i["courseCode"] == j["courseCode"]:
                    NotFoundInOldList = False
            if NotFoundInOldList:
                res.append(i)
        return res

    def grade_diff(self):
        # 读取现有grade
        with open("grade.json" , "r" , encoding="UTF-8") as f:
            oldGrade = json.load(f)
        oldGradeList = []
        for i in oldGrade.keys():
            oldGradeList = oldGradeList + oldGrade[i]
        newGradeList = []
        for i in self.grade.keys():
            newGradeList = newGradeList + self.grade[i]
        #计算差
        diff = self.list_diff(bigList=newGradeList , smallList=oldGradeList)
        return diff

    def __init__(self , header , url , id , pwd , api) -> None:
        self.url    = url
        self.data   = None
        self.grade  = {}
        self.api    = api
        self.id     = id
        self.pwd    = pwd
        self.header = header
        # print(header)
        # input()

    def fetch(self):
        response = requests.get(url=self.url , headers=self.header)
        # print(response)
        try:
            self.data = response.json()
        except:
            # print(response.json())
            return None
        return self.data

    def get_useful_info(self):
        for i in self.data["data"]:
            semesterName = i["semester"]["name"]
            if semesterName not in self.grade.keys():
                self.grade[semesterName] = []
            singleCourseGrade = {}
            singleCourseGrade.update(self.copy_items(fromDir=i , itemsToCopy=["courseCode" , "courseNameZh" , "credits" , "finalGrade" , "gp" , "gradeDetail" , "lessonCode"]))
            self.grade[semesterName].append(singleCourseGrade)
        self.grade = sort_dict(self.grade)
        return self.grade
        pass

    def save_to_file(self , filename):
        str = json.dumps(self.grade , ensure_ascii = False)
        with open(filename , "w" , encoding='utf-8') as f:
            f.write(str)
