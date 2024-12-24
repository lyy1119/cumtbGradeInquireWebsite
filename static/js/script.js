async function loadJSON() {
    try {
        // 检查缓存中是否有数据
        let jsonData = localStorage.getItem("gradeData");
        let jsonData2 = localStorage.getItem("infoData");
        // 如果缓存中没有数据，则从服务器请求
        if (!jsonData || !jsonData2) {
            const response = await fetch('/grade_data');
            jsonData = await response.json();
            const response2 = await fetch('/info');
            jsonData2 = await response2.json();

            // 将加载的数据存入缓存
            localStorage.setItem("gradeData", JSON.stringify(jsonData));
            localStorage.setItem("infoData", JSON.stringify(jsonData2));
        } else {
            // 如果缓存中有数据，则直接使用
            jsonData = JSON.parse(jsonData);
            jsonData2 = JSON.parse(jsonData2);
        }
        generateTable(jsonData);
        update_info(jsonData2);
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

// 默认选项
var option = "all";

function generateTable(jsonData) {
    // 找到主体，也就是要插入的位置 id=contentTable
    var table = document.getElementById("contentTable");
    table.innerHTML = "";
    // 设置标记，用于改变颜色
    let sign = 1;
    // 写入select选项
    let selectLable = document.getElementById("semesterSelect");
    selectLable.innerHTML = "<option value='all'>全部</option>"; // 清空旧选项
    Object.keys(jsonData).forEach(semesterName => {
        let newOption = document.createElement("option");
        newOption.value = semesterName;
        newOption.text = semesterName;
        selectLable.appendChild(newOption);
    });
    selectLable.value = option;
    // 遍历数据，使用key名，即学期名，如2024-2025-1
    let showArray = [];
    if (option === "all") {
        showArray = sortStrings(Object.keys(jsonData));
    }
    else {
        showArray = [option];
    }
    showArray.forEach(semesterName => {
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
            newDetail.innerHTML = courseJson["gradeDetail"].replace(/;/g, "<br>");


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

function update_info(jsonData) {
    let id = document.getElementById("id")
    let time = document.getElementById("update_time")
    id.innerHTML = (jsonData["id"]);
    time.innerHTML = (jsonData["update_time"]);
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

window.onload = function () {
    // 确保 DOM 加载完成后再执行
    loadJSON();

    const selectMenu = document.getElementById("semesterSelect");
    selectMenu.addEventListener('change', () => {
        const selectedValue = selectMenu.value;
        option = selectedValue;
        loadJSON();
    });
};
