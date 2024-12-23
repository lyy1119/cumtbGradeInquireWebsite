async function loadJSON() {
    // let inquireFinish = 0;
    // while(1)
    // {
    //     let state = fetch('/state');
    //     inquireFinish = state["state"];
    //     if (inquireFinish == 1)
    //     {
    //         break;
    //     }
    //     await sleep(500);
    // }
    try {
        const response = await fetch('/grade_data');
        const jsonData = await response.json();
        const response2 = await fetch('/info');
        const jsonData2 = await response2.json();
        generateTable(jsonData);
        update_info(jsonData2);
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateTable(jsonData) {
    // 找到主体，也就是要插入的位置 id=contentTable
    var table = document.getElementById("contentTable");
    // 设置标记，用于改变颜色
    let sign = 1;
    // 遍历数据，使用key名，即学期名，如2024-2025-1
    sortStrings(Object.keys(jsonData)).forEach(semesterName => {
        //  创建新表体
        let newTableBody = document.createElement("div");
        // 增加div的class，用于css样式
        // 一个tableBodyContainer用于展示一个学期
        newTableBody.classList.add("tableBodyContainer");
        // 绘制表体的学期、成绩，
        // 学期名
        // 增加semesterLayout div 内容为空，用于布局
        let semesterLayout = document.createElement("div");
        semesterLayout.classList.add("semesterLayout");
        newTableBody.appendChild(semesterLayout);

        let newBodySemesterName = document.createElement("div");
        newBodySemesterName.classList.add("semester");
        newBodySemesterName.textContent = semesterName;
        semesterLayout.appendChild(newBodySemesterName);
        // 将学期信息div放入单个学期的表体
        // 绘制分割线
        let betweenCourseHorizonLine = document.createElement("div");
        betweenCourseHorizonLine.classList.add("betweenCourseHorizonLine");
        let lineDivInBetweenCourseHorizonLine = document.createElement("div");
        lineDivInBetweenCourseHorizonLine.classList.add("lineDivInBetweenCourseHorizonLine");
        betweenCourseHorizonLine.appendChild(lineDivInBetweenCourseHorizonLine);
        newTableBody.appendChild(betweenCourseHorizonLine);
        // 学期成绩列
        let newBodyInfoGrid = document.createElement("div");
        newBodyInfoGrid.classList.add("infoGrid");
        // 添加若干行到表体的第二列
        jsonData[semesterName].forEach(courseJson => {
            // 绘制单科div框
            let singleCourseDiv = document.createElement("div");
            singleCourseDiv.classList.add("singleCourseContainer");
            // if(sign == 1) {singleCourseDiv.classList.add("coloredSingleCourseContainer")}
            // sign = sign * (-1);

            let newCourseInfo = document.createElement("div");
            newCourseInfo.classList.add("courseInfo");

            // 绘制courseName
            let newCourseName = document.createElement("div");
            newCourseName.classList.add("courseContainer");

            let newCourseId = document.createElement("div");
            newCourseId.classList.add("courseId");
            newCourseId.textContent = courseJson["courseCode"];
            let newCredit = document.createElement("div");
            newCredit.classList.add("credit");
            newCredit.textContent = courseJson["credits"];
            let newName = document.createElement("div");
            newName.classList.add("courseName");
            newName.textContent = courseJson["courseNameZh"];

            newCourseName.appendChild(newCourseId);
            newCourseName.appendChild(newCredit);
            newCourseName.appendChild(newName);

            newCourseInfo.append(newCourseName);

            // 绘制gp
            let newGp = document.createElement("div");
            newGp.classList.add("gp");
            newGp.textContent = courseJson["gp"];
            // 绘制marks
            let newMarks = document.createElement("div");
            newMarks.classList.add("marks");
            newMarks.textContent = courseJson["finalGrade"];
            // 绘制 detail
            let newDetail = document.createElement("div");
            newDetail.classList.add("detail");
            newDetail.textContent = courseJson["gradeDetail"];


            singleCourseDiv.appendChild(newDetail);
            singleCourseDiv.appendChild(newMarks);
            singleCourseDiv.appendChild(newGp);
            singleCourseDiv.appendChild(newCourseInfo);
            newBodyInfoGrid.appendChild(singleCourseDiv);
            

            // 绘制分割线
            let betweenCourseHorizonLine = document.createElement("div");
            betweenCourseHorizonLine.classList.add("betweenCourseHorizonLine");
            let lineDivInBetweenCourseHorizonLine = document.createElement("div");
            lineDivInBetweenCourseHorizonLine.classList.add("lineDivInBetweenCourseHorizonLine");
            betweenCourseHorizonLine.appendChild(lineDivInBetweenCourseHorizonLine);
            newBodyInfoGrid.appendChild(betweenCourseHorizonLine);
        });
        newTableBody.appendChild(newBodyInfoGrid);
        // 将整个表体添加到主表中去
        table.appendChild(newTableBody);

    });
}

function sortStrings(arr) {
    return arr.sort((a, b) => {
        // 按 - 分割字符串
        const [year1A, year2A, termA] = a.split('-').map(Number);
        const [year1B, year2B, termB] = b.split('-').map(Number);

        // 比较年份部分
        if (year1A !== year1B) return year1B - year1A; // 按第一个年份从大到小排序
        if (year2A !== year2B) return year2B - year2A; // 按第二个年份从大到小排序

        // 如果年份相同，按学期从大到小排序
        return termB - termA;
    });
}

function update_info(jsonData) {
    let id = document.getElementById("id")
    let time = document.getElementById("update_time")
    id.innerHTML = (jsonData["id"]);
    time.innerHTML = (jsonData["update_time"]);
}
// if(js_execution){
//     loadJSON();
// }
loadJSON();