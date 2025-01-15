function showAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'block';
}

function hideAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'none';
    document.getElementById('studentForm').reset();
}

window.onclick = function(event) {
    const modal = document.getElementById('addStudentModal');
    if (event.target == modal) {
        hideAddStudentModal();
    }
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.querySelector('.toggle-btn:first-child').classList.add('active');
    document.querySelector('.toggle-btn:last-child').classList.remove('active');
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none'; 
    document.getElementById('signupForm').style.display = 'block';
    document.querySelector('.toggle-btn:first-child').classList.remove('active');
    document.querySelector('.toggle-btn:last-child').classList.add('active');
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find(u => u.username === username && u.password === password);

    if (user) {
        document.getElementById('loginError').style.display = 'none';
        startApp();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function signup() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        document.getElementById('signupError').style.display = 'block';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.username === username)) {
        document.getElementById('signupError').textContent = 'Username already exists';
        document.getElementById('signupError').style.display = 'block';
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    document.getElementById('signupError').style.display = 'none';
    showLogin();
}

function deleteAccount() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === username && u.password === password);

    if (userIndex !== -1) {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            users.splice(userIndex, 1);
            localStorage.setItem('users', JSON.stringify(users));
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
            alert('Account successfully deleted');
        }
    } else {
        alert('Invalid credentials. Please check your username and password.');
    }
}

function startApp() {
    const openingScreen = document.getElementById('openingScreen');
    openingScreen.style.opacity = '0';
    setTimeout(() => {
        openingScreen.style.display = 'none';
    }, 500);
}

window.onload = function() {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
        updateDisplay();
    }
};

function updateDisplay() {
    updateStudentList();
    updateSummary();
    updateSectionSummary();
    localStorage.setItem('students', JSON.stringify(students));
}

const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
    themeLabel.textContent = savedTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
}

themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeLabel.textContent = 'Dark Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeLabel.textContent = 'Light Mode';
    }
});

let students = [];

document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const student = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        section: document.getElementById('section').value,
        amount: parseFloat(document.getElementById('amount').value),
        isPaid: document.getElementById('isPaid').value === 'true'
    };
    
    students.push(student);
    updateDisplay();
    this.reset();
    hideAddStudentModal();
});

document.getElementById('studentEditForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const index = document.getElementById('editIndex').value;
    students[index] = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        section: document.getElementById('editSection').value,
        amount: parseFloat(document.getElementById('editAmount').value),
        isPaid: document.getElementById('editIsPaid').value === 'true'
    };
    
    hideEditForm();
    updateDisplay();
});

function showEditForm(index) {
    const student = students[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('editFirstName').value = student.firstName;
    document.getElementById('editLastName').value = student.lastName;
    document.getElementById('editSection').value = student.section;
    document.getElementById('editAmount').value = student.amount;
    document.getElementById('editIsPaid').value = student.isPaid.toString();
    
    document.getElementById('editForm').style.display = 'block';
}

function hideEditForm() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('studentEditForm').reset();
}

function updateDisplay() {
    updateStudentList();
    updateSummary();
    updateSectionSummary();
}

function updateStudentList() {
    const sectionLists = document.getElementById('sectionLists');
    sectionLists.innerHTML = '';
    
    const sectionData = {};
    students.forEach(student => {
        if (!sectionData[student.section]) {
            sectionData[student.section] = [];
        }
        sectionData[student.section].push(student);
    });

    for (const [section, sectionStudents] of Object.entries(sectionData)) {
        const sectionDiv = document.createElement('div');
        sectionDiv.innerHTML = `
            <h3 class="section-header">Section: ${section}</h3>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${sectionStudents.map((student, index) => `
                        <tr>
                            <td>${student.firstName}</td>
                            <td>${student.lastName}</td>
                            <td>₱${student.amount}</td>
                            <td class="${student.isPaid ? 'status-paid' : 'status-unpaid'}">
                                ${student.isPaid ? 'PAID' : 'UNPAID'}
                            </td>
                            <td>
                                <button onclick="togglePaymentStatus(${students.indexOf(student)})" class="btn">
                                    ${student.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                                </button>
                                <button onclick="showEditForm(${students.indexOf(student)})" class="btn">Edit</button>
                                <button onclick="deleteStudent(${students.indexOf(student)})" class="btn">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        sectionLists.appendChild(sectionDiv);
    }
}

function updateSummary() {
    const totalAmount = students.reduce((sum, student) => sum + student.amount, 0);
    const totalPaid = students.filter(student => student.isPaid).length;
    
    document.getElementById('totalAmount').textContent = totalAmount;
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalPaid').textContent = totalPaid;
    document.getElementById('totalUnpaid').textContent = students.length - totalPaid;
}

function updateSectionSummary() {
    const sectionData = {};
    
    students.forEach(student => {
        if (!sectionData[student.section]) {
            sectionData[student.section] = {
                count: 0,
                total: 0,
                paid: 0,
                unpaid: 0
            };
        }
        sectionData[student.section].count++;
        sectionData[student.section].total += student.amount;
        if (student.isPaid) {
            sectionData[student.section].paid++;
        } else {
            sectionData[student.section].unpaid++;
        }
    });

    const sectionSummary = document.getElementById('sectionSummary');
    sectionSummary.innerHTML = '';
    
    for (const [section, data] of Object.entries(sectionData)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${section}</td>
            <td>${data.count}</td>
            <td>₱${data.total}</td>
            <td>${data.paid}</td>
            <td>${data.unpaid}</td>
        `;
        sectionSummary.appendChild(row);
    }
}

function togglePaymentStatus(index) {
    students[index].isPaid = !students[index].isPaid;
    updateDisplay();
}

function deleteStudent(index) {
    if (confirm('Are you sure you want to delete this student?')) {
        students.splice(index, 1);
        updateDisplay();
    }
}

function importFromExcel(input) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        
        students = [];

        workbook.SheetNames.forEach(sheetName => {
            if (sheetName !== 'Summary') {
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

                let currentSection = '';
                let isPaidSection = false;

                jsonData.forEach(row => {
                    if (row && row.length > 0) {
                        if (row[0].startsWith('Section:')) {
                            currentSection = row[0].replace('Section:', '').trim();
                        }
                        else if (row[0] === 'PAID STUDENTS') {
                            isPaidSection = true;
                        }
                        else if (row[0] === 'UNPAID STUDENTS') {
                            isPaidSection = false;
                        }
                        else if (row.length >= 3 && row[0] !== 'First Name' && !row[0].startsWith('Section Summary')) {
                            if (row[0] && row[1] && row[2]) {
                                const student = {
                                    firstName: row[0],
                                    lastName: row[1],
                                    amount: parseFloat(row[2].replace('₱', '')),
                                    section: currentSection,
                                    isPaid: isPaidSection
                                };
                                students.push(student);
                            }
                        }
                    }
                });
            }
        });

        updateDisplay();
    };

    reader.readAsArrayBuffer(file);
}

function exportToExcel() {
    const wb = XLSX.utils.book_new();
    
    const sectionData = {};
    students.forEach(student => {
        if (!sectionData[student.section]) {
            sectionData[student.section] = [];
        }
        sectionData[student.section].push(student);
    });

    for (const [section, sectionStudents] of Object.entries(sectionData)) {
        const totalStudents = sectionStudents.length;
        const totalAmount = sectionStudents.reduce((sum, student) => sum + student.amount, 0);
        const paidStudents = sectionStudents.filter(student => student.isPaid).length;
        const unpaidStudents = totalStudents - paidStudents;

        const paidStudentsList = sectionStudents.filter(student => student.isPaid);
        const unpaidStudentsList = sectionStudents.filter(student => !student.isPaid);

        const ws_data = [
            [`Section: ${section}`],
            [],
            ['PAID STUDENTS'],
            ['First Name', 'Last Name', 'Amount', 'Payment Status'],
            ...paidStudentsList.map(student => [
                student.firstName,
                student.lastName,
                `₱${student.amount}`,
                'PAID'
            ]),
            [],
            ['UNPAID STUDENTS'],
            ['First Name', 'Last Name', 'Amount', 'Payment Status'],
            ...unpaidStudentsList.map(student => [
                student.firstName,
                student.lastName,
                `₱${student.amount}`,
                'UNPAID'
            ]),
            [],
            ['Section Summary'],
            ['Total Students:', totalStudents],
            ['Total Amount:', `₱${totalAmount}`],
            ['Paid Students:', paidStudents],
            ['Unpaid Students:', unpaidStudents]
        ];

        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, section);
    }

    const summaryData = [
        ['Overall Summary'],
        ['Section', 'Total Students', 'Total Amount', 'Paid Students', 'Unpaid Students'],
        ...Object.entries(sectionData).map(([section, sectionStudents]) => [
            section,
            sectionStudents.length,
            `₱${sectionStudents.reduce((sum, student) => sum + student.amount, 0)}`,
            sectionStudents.filter(student => student.isPaid).length,
            sectionStudents.filter(student => !student.isPaid).length
        ])
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    XLSX.writeFile(wb, "student_treasurer_data.xlsx");
}