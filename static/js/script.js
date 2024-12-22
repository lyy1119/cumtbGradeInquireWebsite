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
    var table = document.getElementById("maintable");
    let sign = 1;
    Object.keys(jsonData).forEach(semesterName => {
        //  创建新表体
        let newTableBody = document.createElement("div");
        // newTableBody.id = semesterName;
        newTableBody.classList.add("tableBodyContainer");
        // 绘制表体的第一、二列
        // 学期名
        let newBodySemesterName = document.createElement("div");
        newBodySemesterName.classList.add("semesterName");
        newBodySemesterName.textContent = semesterName;
        newTableBody.appendChild(newBodySemesterName);
        // 学期成绩列
        let newBodyInfoGrid = document.createElement("div");
        newBodyInfoGrid.classList.add("infoGrid");
        // 添加若干行到表体的第二列
        jsonData[semesterName].forEach(courseJson => {
            // 绘制单科div框
            let singleCourseDiv = document.createElement("div");
            singleCourseDiv.classList.add("singleCourseContainer");
            if(sign == 1) {singleCourseDiv.classList.add("coloredSingleCourseContainer")}
            sign = sign * (-1);

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
            newTableBody.appendChild(newBodyInfoGrid);
        });
        
        // 将整个表体添加到主表中去
        table.appendChild(newTableBody);

    });
}

function update_info(jsonData) {
    let id = document.getElementById("id")
    let time = document.getElementById("update_time")
    id.innerHTML = "学号：" + (jsonData["id"]);
    time.innerHTML = "获取时间:" + (jsonData["update_time"]);
}
// if(js_execution){
//     loadJSON();
// }
loadJSON();