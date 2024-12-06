let students = [];
let pendingDeleteId = null; // ID دانش‌آموزی که برای حذف در نظر گرفته شده است
let deleteTimeout = null; // تایمر برای حذف

// ذخیره داده‌ها در Local Storage
function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
}

// بارگذاری داده‌ها از Local Storage
function loadFromLocalStorage() {
    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
        students = JSON.parse(storedStudents);
        displayStudents();
    }
}

// افزودن دانش‌آموز
function addStudent() {
    const name = document.getElementById("name").value;
    const school = document.getElementById("school").value;
    const grade = document.getElementById("grade").value;
    const studentClass = document.getElementById("class").value;
    const phone = document.getElementById("phone").value || '-';

    if (!name || !school || !grade || !studentClass) {
        alert("لطفاً تمام اطلاعات ضروری را وارد کنید!");
        return;
    }

    const student = {
        id: Date.now(),
        name,
        school,
        grade,
        class: studentClass,
        phone,
        score: 0
    };

    students.push(student);
    displayStudents();
    saveToLocalStorage();
    document.getElementById("student-form").reset();
}

// نمایش لیست دانش‌آموزان
function displayStudents() {
    const tableBody = document.getElementById("students-table");
    tableBody.innerHTML = "";

    // مرتب‌سازی دانش‌آموزان بر اساس امتیاز (نزولی)
    students.sort((a, b) => b.score - a.score);

    students.forEach(student => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.school}</td>
            <td>${student.grade}</td>
            <td>${student.class}</td>
            <td class="phone">${student.phone}</td>
            <td>${student.score}</td>
            <td>
                <button onclick="editScore(${student.id})">امتیاز</button>
                <button class="delete-btn" onclick="confirmDelete(${student.id})">حذف</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// تایید حذف دانش‌آموز
function confirmDelete(id) {
    // نشان دادن پیام تایید حذف
    if (confirm("آیا از حذف این دانش‌آموز اطمینان دارید؟")) {
        pendingDeleteId = id;
        showDeleteTimer();
    }
}

// نمایش تایمر برای حذف
function showDeleteTimer() {
    const timerElement = document.createElement('div');
    timerElement.id = 'delete-timer';
    timerElement.innerHTML = `
        <p>حذف دانش‌آموز در حال انجام است... (<span id="countdown">5</span> ثانیه)</p>
        <button onclick="cancelDelete()">لغو</button>
    `;
    document.body.appendChild(timerElement);

    let countdown = 5;
    deleteTimeout = setInterval(() => {
        countdown--;
        document.getElementById("countdown").textContent = countdown;

        if (countdown <= 0) {
            clearInterval(deleteTimeout);
            deleteStudent(pendingDeleteId);
            document.body.removeChild(timerElement);
        }
    }, 1000);
}

// لغو حذف دانش‌آموز
function cancelDelete() {
    clearInterval(deleteTimeout);
    document.body.removeChild(document.getElementById("delete-timer"));
    pendingDeleteId = null;
}

// حذف دانش‌آموز
function deleteStudent(id) {
    students = students.filter(student => student.id !== id);
    displayStudents();
    saveToLocalStorage();
}

// ویرایش امتیاز دانش‌آموز
function editScore(id) {
    const newScore = prompt("امتیاز جدید را وارد کنید:");
    if (newScore === null || isNaN(newScore)) return;

    students = students.map(student => {
        if (student.id === id) {
            student.score = parseInt(newScore, 10);
        }
        return student;
    });

    displayStudents();
    saveToLocalStorage();
}

// بارگذاری داده‌ها هنگام باز کردن صفحه
window.onload = loadFromLocalStorage;

// اسکریپت برای کنترل باز و بسته شدن توضیحات
document.querySelector('.accordion').addEventListener('click', function() {
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
});
