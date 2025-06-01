document.addEventListener('DOMContentLoaded', function() {
    // CGPA Calculator Functionality (unchanged)
    const cgpaCalculator = {
        init: function() {
            this.cacheElements();
            this.bindEvents();
        },
        
        cacheElements: function() {
            this.currentCgpaInput = document.getElementById('current-cgpa');
            this.completedCreditsInput = document.getElementById('completed-credits');
            this.coursesContainer = document.getElementById('courses-container');
            this.addCourseBtn = document.getElementById('add-course');
            this.calculateBtn = document.getElementById('calculate-cgpa');
            this.resetBtn = document.getElementById('reset-cgpa');
            this.printBtn = document.getElementById('print-cgpa');
            this.semesterGpaDisplay = document.getElementById('semester-gpa');
            this.newCgpaDisplay = document.getElementById('new-cgpa');
        },
        
        bindEvents: function() {
            this.addCourseBtn.addEventListener('click', this.addCourse.bind(this));
            this.calculateBtn.addEventListener('click', this.calculateCgpa.bind(this));
            this.resetBtn.addEventListener('click', this.resetCalculator.bind(this));
            this.printBtn.addEventListener('click', this.printResults.bind(this));
            
            // Add initial course
            this.addCourse();
        },
        
        addCourse: function() {
            const courseRow = document.createElement('div');
            courseRow.className = 'course-row';
            
            const gradeSelect = document.createElement('select');
            gradeSelect.className = 'course-grade';
            gradeSelect.innerHTML = `
                <option value="">Select Grade</option>
                <option value="4.0">A+</option>
                <option value="3.75">A</option>
                <option value="3.5">A-</option>
                <option value="3.25">B+</option>
                <option value="3.0">B</option>
                <option value="2.7">B-</option>
                <option value="2.3">C+</option>
                <option value="2.0">C</option>
                <option value="1.7">C-</option>
                <option value="1.3">D+</option>
                <option value="1.0">D</option>
                <option value="0.0">F</option>
            `;
            
            const creditInput = document.createElement('input');
            creditInput.type = 'number';
            creditInput.className = 'course-credit';
            creditInput.min = '1';
            creditInput.max = '4';
            creditInput.placeholder = 'Credits';
            creditInput.value = '3';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-course';
            removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
            removeBtn.addEventListener('click', function() {
                if (document.querySelectorAll('.course-row').length > 1) {
                    courseRow.remove();
                } else {
                    alert('You need at least one course');
                }
            });
            
            courseRow.appendChild(gradeSelect);
            courseRow.appendChild(creditInput);
            courseRow.appendChild(removeBtn);
            
            this.coursesContainer.appendChild(courseRow);
        },
        
        calculateCgpa: function() {
            const currentCgpa = parseFloat(this.currentCgpaInput.value) || 0;
            const completedCredits = parseInt(this.completedCreditsInput.value) || 0;
            
            let totalGradePoints = 0;
            let totalCredits = 0;
            let allValid = true;
            
            document.querySelectorAll('.course-row').forEach(row => {
                const grade = parseFloat(row.querySelector('.course-grade').value);
                const credits = parseFloat(row.querySelector('.course-credit').value);
                
                if (isNaN(grade) || isNaN(credits)) {
                    allValid = false;
                    return;
                }
                
                totalGradePoints += grade * credits;
                totalCredits += credits;
            });
            
            if (!allValid) {
                alert('Please fill all grade and credit fields');
                return;
            }
            
            if (totalCredits === 0) {
                alert('Please add at least one course');
                return;
            }
            
            const semesterGpa = totalGradePoints / totalCredits;
            let newCgpa = semesterGpa;
            
            if (completedCredits > 0) {
                const totalGradePointsBefore = currentCgpa * completedCredits;
                newCgpa = (totalGradePointsBefore + totalGradePoints) / (completedCredits + totalCredits);
            }
            
            this.semesterGpaDisplay.textContent = semesterGpa.toFixed(2);
            this.newCgpaDisplay.textContent = newCgpa.toFixed(2);
        },
        
        resetCalculator: function() {
            this.currentCgpaInput.value = '';
            this.completedCreditsInput.value = '';
            this.semesterGpaDisplay.textContent = '-';
            this.newCgpaDisplay.textContent = '-';
            
            // Remove all but one course row
            const rows = document.querySelectorAll('.course-row');
            for (let i = 1; i < rows.length; i++) {
                rows[i].remove();
            }
            
            // Reset the first row
            const firstRow = rows[0];
            firstRow.querySelector('.course-grade').value = '';
            firstRow.querySelector('.course-credit').value = '3';
        },
        
        printResults: function() {
            const printContent = `
                <h2>EWU CGPA Calculation Result</h2>
                <p><strong>Current CGPA:</strong> ${this.currentCgpaInput.value || 'N/A'}</p>
                <p><strong>Completed Credits:</strong> ${this.completedCreditsInput.value || '0'}</p>
                <h3>Current Semester Courses</h3>
                <ul>
                    ${Array.from(document.querySelectorAll('.course-row')).map(row => {
                        const grade = row.querySelector('.course-grade').value;
                        const credits = row.querySelector('.course-credit').value;
                        return `<li>Grade: ${grade || 'Not selected'}, Credits: ${credits}</li>`;
                    }).join('')}
                </ul>
                <h3>Results</h3>
                <p><strong>Semester GPA:</strong> ${this.semesterGpaDisplay.textContent}</p>
                <p><strong>New CGPA:</strong> ${this.newCgpaDisplay.textContent}</p>
                <p>Generated on ${new Date().toLocaleString()}</p>
            `;
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>EWU CGPA Result</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h2, h3 { color: #0056b3; }
                            ul { margin-left: 20px; }
                        </style>
                    </head>
                    <body>
                        ${printContent}
                        <script>
                            window.onload = function() {
                                window.print();
                                setTimeout(function() { window.close(); }, 1000);
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    // Course Flow Charts Functionality (unchanged)
    const flowCharts = {
        init: function() {
            this.cacheElements();
            this.bindEvents();
            this.loadSampleData();
        },
        
        cacheElements: function() {
            this.departmentSelect = document.getElementById('department-select');
            this.programSelect = document.getElementById('program-select');
            this.flowchartContainer = document.getElementById('flowchart-container');
        },
        
        bindEvents: function() {
            this.departmentSelect.addEventListener('change', this.updateFlowChart.bind(this));
            this.programSelect.addEventListener('change', this.updateFlowChart.bind(this));
        },
        
        loadSampleData: function() {
            this.sampleData = {
                cse: {
                    bsc: {
                        title: "",
                        flowchart: `
                           
                            <div class="semester-flow">
                                <h4>1st Year - 1st Semester (Total Credit: 35)</h4>
                                <ul class="course-list">
                                    <li><strong>CSE103</strong> Structured Programming (4.5)</li>
                                    <li><strong>ENG101</strong> Basic English (3)</li>
                                    <li><strong>MAT101</strong> Differential and Integral Calculus (3)</li>
                                </ul>
                                
                                <h4>1st Year - 2nd Semester</h4>
                                <ul class="course-list">
                                    <li><strong>CHE109</strong> Engineering Chemistry (4)</li>
                                    <li><strong>CSE106</strong> Discrete Mathematics (3)</li>
                                    <li><strong>ENG102</strong> Composition And Communication Skills (3)</li>
                                    <li><strong>MAT102</strong> Differential Equations and Special Functions (3)</li>
                                </ul>
                                
                                <h4>1st Year - 3rd Semester</h4>
                                <ul class="course-list">
                                    <li><strong>CSE110</strong> Object Oriented Programming (4.5)</li>
                                    <li><strong>MAT104</strong> Coordinate Geometry and Vector Analysis (3)</li>
                                    <li><strong>PHY109</strong> Engineering Physics-I (4)</li>
                                </ul>
                                
                                <h4>2nd Year - 1st Semester</h4>
                                <ul class="course-list">
                                    <li><strong>CSE200</strong> Computer-Aided Engineering Drawing (1)</li>
                                    <li><strong>CSE209</strong> Electrical Circuits (4)</li>
                                    <li><strong>GEN226</strong> Emergence of Bangladesh (3)</li>
                                    <li><strong>STA102</strong> Statistics and Probability (3)</li>
                                </ul>
                                
                                <h4>2nd Year - 2nd Semester</h4>
                                <ul class="course-list">
                                    <li>Elective General Education-I (3)</li>
                                    <li><strong>MAT205</strong> Linear Algebra and Complex Variables (3)</li>
                                    <li><strong>CSE207</strong> Data Structures (4)</li>
                                    <li><strong>CSE251</strong> Electronic Circuits (4)</li>
                                </ul>
                                
                                <h4>2nd Year - 3rd Semester</h4>
                                <ul class="course-list">
                                    <li>Elective General Education-II (3)</li>
                                    <li><strong>PHY209</strong> Engineering Physics-II (3)</li>
                                    <li><strong>CSE325</strong> Operating Systems (4)</li>
                                </ul>
                                
                                <h4>3rd Year - 1st Semester</h4>
                                <ul class="course-list">
                                    <li>Elective General Education-III (3)</li>
                                    <li><strong>CSE246</strong> Algorithms (4.5)</li>
                                    <li><strong>CSE302</strong> Database Systems (4.5)</li>
                                </ul>
                                
                                <h4>3rd Year - 2nd Semester</h4>
                                <ul class="course-list">
                                    <li><strong>CSE345</strong> Digital Logic Design (4)</li>
                                    <li><strong>CSE347</strong> Information System Analysis and Design (4)</li>
                                    <li>Compulsory Major-I (4)</li>
                                </ul>
                                
                                <h4>3rd Year - 3rd Semester</h4>
                                <ul class="course-list">
                                    <li><strong>CSE360</strong> Computer Architecture (3)</li>
                                    <li><strong>CSE405</strong> Computer Networks (4)</li>
                                    <li>Compulsory Major-II (4)</li>
                                </ul>
                                
                                <h4>4th Year - 1st Semester</h4>
                                <ul class="course-list">
                                    <li><strong>CSE400</strong> Capstone Project-I (1)</li>
                                    <li><strong>CSE407</strong> Green Computing (3)</li>
                                    <li>Elective Major-I (4)</li>
                                    <li>Elective Non-Major-I (4)</li>
                                </ul>
                                
                                <h4>4th Year - 2nd Semester</h4>
                                <ul class="course-list">
                                    <li><strong>CSE400</strong> Capstone Project-II (2)</li>
                                    <li><strong>CSE487</strong> Cyber Security, Ethics and Law (3)</li>
                                    <li>Elective Major-II (4)</li>
                                    <li>Elective Non-Major-II (4)</li>
                                </ul>
                                
                                <h4>4th Year - 3rd Semester</h4>
                                <ul class="course-list">
                                    <li><strong>CSE400</strong> Capstone Project-III (3)</li>
                                    <li><strong>CSE495</strong> IT Project Management and Entrepreneurship (3)</li>
                                    <li>Elective Major-III (4)</li>
                                </ul>
                            </div>
                        `
                    },
                    msc: {
                        title: "MSc in Computer Science & Engineering",
                        flowchart: "MSc CSE flowchart would go here..."
                    }
                },
                eee: {
                    bsc: {
                        title: "BSc in Electrical & Electronic Engineering",
                        flowchart: "BSc EEE flowchart would go here..."
                    }
                },
                bba: {
                    bsc: {
                        title: "Bachelor of Business Administration",
                        flowchart: "BBA flowchart would go here..."
                    }
                }
            };
        },
        
        updateFlowChart: function() {
            const department = this.departmentSelect.value;
            const program = this.programSelect.value;
            
            if (!department || !program) {
                this.flowchartContainer.innerHTML = `
                    <div class="placeholder">
                        <i class="fas fa-university"></i>
                        <p>Select your department and program to view the course flow chart</p>
                    </div>
                `;
                return;
            }
            
            const data = this.sampleData[department]?.[program];
            
            if (data) {
                this.flowchartContainer.innerHTML = `
                    <h3>${data.title}</h3>
                    ${data.flowchart}
                `;
            } else {
                this.flowchartContainer.innerHTML = `
                    <div class="error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>No flow chart available for the selected combination</p>
                    </div>
                `;
            }
        }
    };

    // Tuition Fee Calculator Functionality (unchanged)
    const feeCalculator = {
        init: function() {
            this.cacheElements();
            this.bindEvents();
            this.loadFeeStructure();
        },
        
        cacheElements: function() {
            this.departmentSelect = document.getElementById('fee-department');
            this.semesterTypeSelect = document.getElementById('semester-type');
            this.creditHoursInput = document.getElementById('credit-hours');
            this.scholarshipInput = document.getElementById('scholarship');
            this.calculateBtn = document.getElementById('calculate-fee');
            this.resetBtn = document.getElementById('reset-fee');
            this.tuitionFeeDisplay = document.getElementById('tuition-fee');
            this.otherFeesDisplay = document.getElementById('other-fees');
            this.scholarshipDisplay = document.getElementById('scholarship-amount');
            this.totalFeeDisplay = document.getElementById('total-fee');
        },
        
        bindEvents: function() {
            this.calculateBtn.addEventListener('click', this.calculateFees.bind(this));
            this.resetBtn.addEventListener('click', this.resetCalculator.bind(this));
        },
        
        loadFeeStructure: function() {
            this.feeStructure = {
                cse: {
                    regular: { perCredit: 4500, otherFees: 12000 },
                    summer: { perCredit: 3500, otherFees: 8000 }
                },
                eee: {
                    regular: { perCredit: 4000, otherFees: 11000 },
                    summer: { perCredit: 3000, otherFees: 7000 }
                },
                bba: {
                    regular: { perCredit: 3500, otherFees: 9000 },
                    summer: { perCredit: 2500, otherFees: 6000 }
                },
                eco: {
                    regular: { perCredit: 3000, otherFees: 8000 },
                    summer: { perCredit: 2000, otherFees: 5000 }
                },
                eng: {
                    regular: { perCredit: 3000, otherFees: 8000 },
                    summer: { perCredit: 2000, otherFees: 5000 }
                }
            };
        },
        
        calculateFees: function() {
            const department = this.departmentSelect.value;
            const semesterType = this.semesterTypeSelect.value;
            const creditHours = parseInt(this.creditHoursInput.value) || 0;
            const scholarship = parseInt(this.scholarshipInput.value) || 0;
            
            if (!department) {
                alert('Please select your department');
                return;
            }
            
            if (creditHours < 1 || creditHours > 21) {
                alert('Credit hours must be between 1 and 21');
                return;
            }
            
            if (scholarship < 0 || scholarship > 100) {
                alert('Scholarship must be between 0 and 100');
                return;
            }
            
            const feeInfo = this.feeStructure[department][semesterType];
            const tuitionFee = feeInfo.perCredit * creditHours;
            const otherFees = feeInfo.otherFees;
            const scholarshipAmount = (tuitionFee * scholarship) / 100;
            const totalFee = (tuitionFee + otherFees) - scholarshipAmount;
            
            this.tuitionFeeDisplay.textContent = `${tuitionFee.toLocaleString()} BDT`;
            this.otherFeesDisplay.textContent = `${otherFees.toLocaleString()} BDT`;
            this.scholarshipDisplay.textContent = `${scholarshipAmount.toLocaleString()} BDT (${scholarship}%)`;
            this.totalFeeDisplay.textContent = `${totalFee.toLocaleString()} BDT`;
        },
        
        resetCalculator: function() {
            this.departmentSelect.value = '';
            this.semesterTypeSelect.value = 'regular';
            this.creditHoursInput.value = '15';
            this.scholarshipInput.value = '0';
            this.tuitionFeeDisplay.textContent = '-';
            this.otherFeesDisplay.textContent = '-';
            this.scholarshipDisplay.textContent = '-';
            this.totalFeeDisplay.textContent = '-';
        }
    };

    // Routine Generator Functionality (updated)
    const routineGenerator = {
        courses: [],
        init: function() {
            this.cacheElements();
            this.bindEvents();
            this.setupCourseTypeToggle();
        },
        
        cacheElements: function() {
            this.courseCodeInput = document.getElementById('course-code');
            this.courseTitleInput = document.getElementById('course-title');
            this.courseTypeInput = document.getElementById('course-type');
            this.theorySessionsContainer = document.getElementById('theory-sessions-container');
            this.labSessionContainer = document.getElementById('lab-session-container');
            this.facultyInput = document.getElementById('faculty-name');
            this.roomInput = document.getElementById('room-number');
            this.addCourseBtn = document.getElementById('add-course-btn');
            this.courseList = document.getElementById('course-list');
            this.routineDisplay = document.getElementById('routine-display');
            this.generateBtn = document.getElementById('generate-routine');
            this.printBtn = document.getElementById('print-routine');
            this.clearBtn = document.getElementById('clear-routine');
            
            // Get all session inputs
            this.theoryDays = this.theorySessionsContainer.querySelectorAll('.class-day');
            this.theoryTimes = this.theorySessionsContainer.querySelectorAll('.class-time');
            this.theoryDurations = this.theorySessionsContainer.querySelectorAll('.class-duration');
            
            this.labDay = this.labSessionContainer.querySelector('.class-day');
            this.labTime = this.labSessionContainer.querySelector('.class-time');
            this.labDuration = this.labSessionContainer.querySelector('.class-duration');
        },
        
        bindEvents: function() {
            this.addCourseBtn.addEventListener('click', this.addCourse.bind(this));
            this.generateBtn.addEventListener('click', this.generateRoutine.bind(this));
            this.printBtn.addEventListener('click', this.printRoutine.bind(this));
            this.clearBtn.addEventListener('click', this.clearAll.bind(this));
        },
        
        setupCourseTypeToggle: function() {
            this.courseTypeInput.addEventListener('change', () => {
                if (this.courseTypeInput.value === 'lab') {
                    this.theorySessionsContainer.style.display = 'none';
                    this.labSessionContainer.style.display = 'block';
                    this.labDuration.value = '3';
                } else {
                    this.theorySessionsContainer.style.display = 'block';
                    this.labSessionContainer.style.display = 'none';
                    this.theoryDurations[0].value = '1.5';
                    this.theoryDurations[1].value = '1.5';
                }
            });
        },
        
        addCourse: function() {
            const code = this.courseCodeInput.value.trim();
            const title = this.courseTitleInput.value.trim();
            const type = this.courseTypeInput.value;
            const faculty = this.facultyInput.value.trim();
            const room = this.roomInput.value.trim();
            
            if (!code || !title || !faculty) {
                this.showToast('Please fill all required fields', 'error');
                return;
            }
            
            const sessions = [];
            if (type === 'lab') {
                const day = this.labDay.value;
                const time = this.labTime.value;
                const duration = parseFloat(this.labDuration.value);
                
                if (!day || !time || isNaN(duration)) {
                    this.showToast('Please fill all lab session details', 'error');
                    return;
                }
                
                sessions.push({
                    day,
                    time,
                    duration,
                    isLab: true
                });
            } else {
                for (let i = 0; i < this.theoryDays.length; i++) {
                    const day = this.theoryDays[i].value;
                    const time = this.theoryTimes[i].value;
                    const duration = parseFloat(this.theoryDurations[i].value);
                    
                    if (!day || !time || isNaN(duration)) continue;
                    
                    sessions.push({
                        day,
                        time,
                        duration,
                        isLab: false
                    });
                }
                
                if (sessions.length === 0) {
                    this.showToast('Please add at least one class session', 'error');
                    return;
                }
            }
            
            const course = {
                id: Date.now(),
                code,
                title,
                type,
                faculty,
                room,
                sessions
            };
            
            this.courses.push(course);
            this.renderCourseList();
            this.clearForm();
            this.showToast('Course added successfully!', 'success');
        },
        
        renderCourseList: function() {
            this.courseList.innerHTML = '';
            
            if (this.courses.length === 0) {
                this.courseList.innerHTML = '<div class="empty-message">No courses added yet</div>';
                return;
            }
            
            this.courses.forEach(course => {
                const courseItem = document.createElement('div');
                courseItem.className = 'course-item';
                courseItem.dataset.id = course.id;
                
                const sessionsText = course.sessions.map(session => {
                    return `${session.day} at ${session.time} (${session.duration}hr${session.isLab ? ' lab' : ''})`;
                }).join(', ');
                
                courseItem.innerHTML = `
                    <div class="course-item-info">
                        <div>
                            <strong>${course.code}</strong>
                            <span class="course-item-type ${course.type}">${course.type === 'theory' ? 'Theory' : 'Lab'}</span>
                        </div>
                        <div class="course-item-sessions">${sessionsText}</div>
                        <div>${course.faculty} ${course.room ? '· Room: ' + course.room : ''}</div>
                    </div>
                    <div class="course-item-actions">
                        <button class="edit-btn" title="Edit course">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" title="Delete course">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                courseItem.querySelector('.delete-btn').addEventListener('click', () => {
                    this.deleteCourse(course.id);
                });
                
                courseItem.querySelector('.edit-btn').addEventListener('click', () => {
                    this.editCourse(course.id);
                });
                
                this.courseList.appendChild(courseItem);
            });
        },
        
        deleteCourse: function(id) {
            this.courses = this.courses.filter(course => course.id !== id);
            this.renderCourseList();
            this.showToast('Course deleted', 'info');
        },
        
        editCourse: function(id) {
            const course = this.courses.find(c => c.id === id);
            if (!course) return;
            
            this.courseCodeInput.value = course.code;
            this.courseTitleInput.value = course.title;
            this.courseTypeInput.value = course.type;
            this.facultyInput.value = course.faculty;
            this.roomInput.value = course.room || '';
            
            if (course.type === 'lab') {
                this.theorySessionsContainer.style.display = 'none';
                this.labSessionContainer.style.display = 'block';
                
                const session = course.sessions[0];
                this.labDay.value = session.day;
                this.labTime.value = session.time;
                this.labDuration.value = session.duration;
            } else {
                this.theorySessionsContainer.style.display = 'block';
                this.labSessionContainer.style.display = 'none';
                
                for (let i = 0; i < course.sessions.length && i < 2; i++) {
                    const session = course.sessions[i];
                    this.theoryDays[i].value = session.day;
                    this.theoryTimes[i].value = session.time;
                    this.theoryDurations[i].value = session.duration;
                }
            }
            
            this.deleteCourse(id);
            this.courseCodeInput.focus();
        },
        
        clearForm: function() {
            this.courseCodeInput.value = '';
            this.courseTitleInput.value = '';
            this.courseTypeInput.value = 'theory';
            this.facultyInput.value = '';
            this.roomInput.value = '';
            
            this.theorySessionsContainer.style.display = 'block';
            this.labSessionContainer.style.display = 'none';
            
            this.theoryDays[0].value = 'Sunday';
            this.theoryTimes[0].value = '08:00';
            this.theoryDurations[0].value = '1.5';
            
            this.theoryDays[1].value = 'Sunday';
            this.theoryTimes[1].value = '09:30';
            this.theoryDurations[1].value = '1.5';
            
            this.labDay.value = 'Sunday';
            this.labTime.value = '08:00';
            this.labDuration.value = '3';
            
            this.courseCodeInput.focus();
        },
        
        generateRoutine: function() {
            if (this.courses.length === 0) {
                this.showToast('Please add at least one course', 'error');
                return;
            }

            const days = [
                { name: 'Sunday', abbr: 'S' },
                { name: 'Monday', abbr: 'M' },
                { name: 'Tuesday', abbr: 'T' },
                { name: 'Wednesday', abbr: 'W' },
                { name: 'Thursday', abbr: 'R' }
            ];

            const timeSlots = [
                { start: '8:30', end: '10:00', label: '8:30 - 10:00' },
                { start: '10:10', end: '11:40', label: '10:10 - 11:40' },
                { start: '11:50', end: '13:20', label: '11:50 - 1:20' },
                { start: '13:30', end: '15:00', label: '1:30 - 3:00' },
                { start: '15:10', end: '16:40', label: '3:10 - 4:40' },
                { start: '16:50', end: '18:20', label: '4:50 - 6:20' }
            ];

            // Create a 2D array to represent the routine table
            const routineGrid = days.map(day => {
                return timeSlots.map(slot => {
                    return {
                        courses: [],
                        rendered: false
                    };
                });
            });

            // Populate the grid with courses
            this.courses.forEach(course => {
                course.sessions.forEach((session, sessionIndex) => {
                    const dayIndex = days.findIndex(d => d.name === session.day);
                    if (dayIndex === -1) return;

                    const sessionStart = this.timeToMinutes(session.time);
                    const sessionEnd = sessionStart + (session.duration * 60);

                    timeSlots.forEach((slot, slotIndex) => {
                        const slotStart = this.timeToMinutes(slot.start);
                        const slotEnd = this.timeToMinutes(slot.end);

                        // Check if session overlaps with this time slot
                        if (sessionStart < slotEnd && sessionEnd > slotStart) {
                            routineGrid[dayIndex][slotIndex].courses.push({
                                course,
                                session,
                                sessionIndex
                            });
                        }
                    });
                });
            });

            // Generate HTML from the grid
            let html = `
                <div class="routine-table-container">
                    <table class="routine-table">
                        <thead>
                            <tr>
                                <th class="day-col">Days</th>
                                ${timeSlots.map(slot => `<th>${slot.label}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
            `;

            days.forEach((day, dayIndex) => {
                html += `<tr><td class="day-col">${day.name} (${day.abbr})</td>`;
                
                timeSlots.forEach((slot, slotIndex) => {
                    const cell = routineGrid[dayIndex][slotIndex];
                    
                    if (cell.rendered || cell.courses.length === 0) {
                        // Skip if already rendered or no courses
                        html += cell.rendered ? '' : '<td></td>';
                        return;
                    }

                    // Find the best matching course for this slot
                    const bestMatch = this.findBestTimeMatch(cell.courses, slot.start, slot.end);
                    if (!bestMatch) {
                        html += '<td></td>';
                        return;
                    }

                    const { course, session, sessionIndex } = bestMatch;
                    const isLab = course.type === 'lab';
                    const roomPrefix = isLab ? 'Lab' : 'R';
                    const sectionInfo = isLab ? 'Lab' : (course.sessions.length > 1 ? 'Sec' + (sessionIndex + 1) : '');

                    // Calculate rowspan (how many slots this session spans)
                    const durationMinutes = session.duration * 60;
                    const slotDuration = this.timeToMinutes(slot.end) - this.timeToMinutes(slot.start);
                    const rowspan = Math.max(1, Math.round(durationMinutes / slotDuration));

                    // Mark subsequent slots as rendered
                    for (let i = 0; i < rowspan && slotIndex + i < timeSlots.length; i++) {
                        routineGrid[dayIndex][slotIndex + i].rendered = true;
                    }

                    html += `
                        <td class="course-slot" rowspan="${rowspan}">
                            <div class="course-block ${isLab ? 'lab-block' : ''}">
                                <div class="course-code">${course.code} ${sectionInfo}</div>
                                <div class="course-room">${roomPrefix}: ${course.room || 'N/A'}</div>
                                ${course.faculty ? `<div class="course-faculty">${course.faculty}</div>` : ''}
                            </div>
                        </td>
                    `;
                });
                
                html += '</tr>';
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;

            this.routineDisplay.innerHTML = html;
            this.printBtn.disabled = false;
            this.showToast('Routine generated successfully!', 'success');
        },

        findBestTimeMatch: function(courses, startTime, endTime) {
            let bestMatch = null;
            let bestScore = -1;
            
            const slotStart = this.timeToMinutes(startTime);
            const slotEnd = this.timeToMinutes(endTime);
            const slotDuration = slotEnd - slotStart;
            
            courses.forEach(courseData => {
                const { course, session } = courseData;
                const sessionStart = this.timeToMinutes(session.time);
                const sessionEnd = sessionStart + (session.duration * 60);
                
                // Calculate overlap score
                const overlapStart = Math.max(sessionStart, slotStart);
                const overlapEnd = Math.min(sessionEnd, slotEnd);
                const overlapDuration = Math.max(0, overlapEnd - overlapStart);
                
                // Calculate how well this session fits the slot
                const score = overlapDuration / slotDuration;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = courseData;
                }
            });
            
            return bestMatch;
        },

        timeToMinutes: function(timeString) {
            // Handle both "HH:MM" and "H:MM" formats
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours * 60 + minutes;
        },
        
        printRoutine: function() {
            const printContent = this.routineDisplay.innerHTML;
            const printWindow = window.open('', '_blank');
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Class Routine</title>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            .routine-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                            .routine-table th, .routine-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                            .routine-table th { background-color: #0056b3; color: white; }
                            .routine-table .day-col { background-color: #f1f1f1; font-weight: bold; width: 100px; }
                            .course-block { background-color: #e7f5ff; border-radius: 4px; padding: 5px; margin: 2px; }
                            .lab-block { background-color: #fff3bf; }
                            .course-code { font-weight: bold; font-size: 0.9rem; }
                            .course-room { font-size: 0.8rem; }
                            .course-faculty { font-size: 0.8rem; font-style: italic; }
                            h1 { color: #0056b3; text-align: center; margin-bottom: 5px; }
                            .print-header { margin-bottom: 20px; }
                            .print-footer { text-align: center; margin-top: 20px; font-size: 0.8rem; color: #666; }
                        </style>
                    </head>
                    <body>
                        <div class="print-header">
                            <h1>Class Routine and Office Hour, Spring 2025</h1>
                        </div>
                        ${printContent}
                        <div class="print-footer">
                            Generated on ${new Date().toLocaleDateString()}
                        </div>
                        <script>
                            window.onload = function() {
                                window.print();
                                setTimeout(function() { window.close(); }, 1000);
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        },
        
        clearAll: function() {
            this.courses = [];
            this.renderCourseList();
            this.routineDisplay.innerHTML = `
                <div class="placeholder">
                    <i class="fas fa-calendar"></i>
                    <p>Your generated routine will appear here</p>
                </div>
            `;
            this.printBtn.disabled = true;
            this.showToast('All courses cleared', 'info');
        },
        
        showToast: function(message, type) {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <div class="toast-message">${message}</div>
                <button class="toast-close">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    routineGenerator.init();
});

// Initialize the routine generator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    routineGenerator.init();
});
    
    // Initialize all components
    cgpaCalculator.init();
    flowCharts.init();
    feeCalculator.init();
    routineGenerator.init();
    
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Set active nav item based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.tool-section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('nav a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${currentSection}`) {
                a.classList.add('active');
            }
        });
    });
});
