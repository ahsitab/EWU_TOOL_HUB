document.addEventListener('DOMContentLoaded', function() {
    // Theme Management (keep existing theme code)
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleHeader = document.getElementById('theme-toggle-header');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    let currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggle(currentTheme);
    
    // Theme toggle functionality
    function toggleTheme() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeToggle(currentTheme);
    }
    
    function updateThemeToggle(theme) {
        if (theme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            themeToggleHeader.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            themeToggleHeader.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    themeToggle.addEventListener('click', toggleTheme);
    themeToggleHeader.addEventListener('click', toggleTheme);
    
    // Show greeting page initially
    const greetingPage = document.getElementById('greeting-page');
    const mainContent = document.getElementById('main-content');
    const toolButtons = document.querySelectorAll('.tool-btn:not(.portal-btn)');
    const backButton = document.getElementById('back-to-home');
    
    // Navigation between greeting page and tools
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            greetingPage.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Hide all sections first
            document.querySelectorAll('.tool-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show only the selected section
            const targetElement = document.getElementById(target);
            if (targetElement) {
                targetElement.style.display = 'block';
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Update active nav item
                document.querySelectorAll('nav a').forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${target}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    });
    
    backButton.addEventListener('click', function() {
        greetingPage.style.display = 'flex';
        mainContent.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Show all sections again when going back
        document.querySelectorAll('.tool-section').forEach(section => {
            section.style.display = 'block';
        });
    });
    
    // Navigation handling for header links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // Hide all sections first
            document.querySelectorAll('.tool-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show only the selected section
            if (targetElement) {
                targetElement.style.display = 'block';
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Set active nav item based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.tool-section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            // Only consider visible sections
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom && 
                section.style.display !== 'none') {
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
    
    // Show first section by default when main content is shown
    if (mainContent.style.display === 'block') {
        document.querySelector('nav a').click();
    }
    
    // CGPA Calculator Functionality
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
        this.hasRetakesSelect = document.getElementById('has-retakes');
        this.retakesContainer = document.getElementById('retakes-container');
        this.retakesList = document.getElementById('retakes-list');
        this.addRetakeBtn = document.getElementById('add-retake');
    },
    
    bindEvents: function() {
        this.addCourseBtn.addEventListener('click', this.addCourse.bind(this));
        this.calculateBtn.addEventListener('click', this.calculateCgpa.bind(this));
        this.resetBtn.addEventListener('click', this.resetCalculator.bind(this));
        this.printBtn.addEventListener('click', this.printResults.bind(this));
        this.hasRetakesSelect.addEventListener('change', this.toggleRetakesContainer.bind(this));
        this.addRetakeBtn.addEventListener('click', this.addRetake.bind(this));
        
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
            <option value="4.0">A+ (4.0)</option>
            <option value="3.75">A (3.75)</option>
            <option value="3.5">A- (3.5)</option>
            <option value="3.25">B+ (3.25)</option>
            <option value="3.0">B (3.0)</option>
            <option value="2.75">B- (2.75)</option>
            <option value="2.5">C+ (2.5)</option>
            <option value="2.25">C (2.25)</option>
            <option value="2.0">D (2.0)</option>
            <option value="0.0">F (0.0)</option>
        `;
        
        const creditInput = document.createElement('input');
        creditInput.type = 'number';
        creditInput.className = 'course-credit';
        creditInput.min = '0.5';
        creditInput.max = '4.5';
        creditInput.step = '0.5';
        creditInput.placeholder = 'Credits';
        creditInput.value = '3';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-course';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
        removeBtn.addEventListener('click', function() {
            if (document.querySelectorAll('.course-row').length > 1) {
                courseRow.remove();
            } else {
                showToast('You need at least one course', 'error');
            }
        });
        
        courseRow.appendChild(gradeSelect);
        courseRow.appendChild(creditInput);
        courseRow.appendChild(removeBtn);
        
        this.coursesContainer.appendChild(courseRow);
    },
    
    toggleRetakesContainer: function() {
        this.retakesContainer.style.display = this.hasRetakesSelect.value === 'yes' ? 'block' : 'none';
    },
    
    addRetake: function() {
        const retakeRow = document.createElement('div');
        retakeRow.className = 'retake-row';
        
        retakeRow.innerHTML = `
            <input type="text" class="retake-code" placeholder="Course Code (e.g., CSE101)">
            <input type="number" class="retake-original-gpa" step="0.01" min="0" max="4.5" placeholder="Original GPA">
            <input type="number" class="retake-credits" min="0.5" max="4.5" step="0.5" placeholder="Credits">
            <input type="number" class="retake-new-gpa" step="0.01" min="0" max="4.5" placeholder="Retake GPA">
            <button class="remove-retake"><i class="fas fa-trash"></i></button>
        `;
        
        retakeRow.querySelector('.remove-retake').addEventListener('click', function() {
            if (document.querySelectorAll('.retake-row').length > 1) {
                retakeRow.remove();
            } else {
                showToast('You need at least one retake row', 'error');
            }
        });
        
        this.retakesList.appendChild(retakeRow);
    },
    
    getRetakeCourses: function() {
        const retakes = [];
        
        document.querySelectorAll('.retake-row').forEach(row => {
            const code = row.querySelector('.retake-code').value.trim().toUpperCase();
            const originalGpa = parseFloat(row.querySelector('.retake-original-gpa').value);
            const credits = parseFloat(row.querySelector('.retake-credits').value);
            const newGpa = parseFloat(row.querySelector('.retake-new-gpa').value);
            
            if (code && !isNaN(originalGpa)) {
                retakes.push({
                    code,
                    originalGpa,
                    credits: isNaN(credits) ? 0 : credits,
                    newGpa: isNaN(newGpa) ? originalGpa : newGpa
                });
            }
        });
        
        return retakes;
    },
    
    calculateCgpa: function() {
        const currentCgpa = parseFloat(this.currentCgpaInput.value) || 0;
        const completedCredits = parseFloat(this.completedCreditsInput.value) || 0;
        
        // Validate current CGPA (0 to 4.5)
        if (currentCgpa < 0 || currentCgpa > 4.5) {
            showToast('Current CGPA must be between 0 and 4.5', 'error');
            return;
        }
        
        // Get retake courses if any
        const retakeCourses = this.hasRetakesSelect.value === 'yes' ? this.getRetakeCourses() : [];
        
        let totalGradePoints = 0;
        let totalCredits = 0;
        let allValid = true;
        
        // Calculate current semester courses
        document.querySelectorAll('.course-row').forEach(row => {
            const grade = parseFloat(row.querySelector('.course-grade').value);
            const credits = parseFloat(row.querySelector('.course-credit').value);
            
            if (isNaN(grade)) {
                row.querySelector('.course-grade').style.borderColor = 'var(--danger-color)';
                allValid = false;
            } else {
                row.querySelector('.course-grade').style.borderColor = '';
            }

            if (isNaN(credits)) {
                row.querySelector('.course-credit').style.borderColor = 'var(--danger-color)';
                allValid = false;
            } else {
                row.querySelector('.course-credit').style.borderColor = '';
            }
            
            // Validate credits (0.5 to 4.5)
            if (credits < 0.5 || credits > 4.5) {
                showToast('Credits must be between 0.5 and 4.5', 'error');
                allValid = false;
                return;
            }
            
            totalGradePoints += grade * credits;
            totalCredits += credits;
        });
        
        if (!allValid) {
            showToast('Please fill all grade and credit fields with valid values', 'error');
            return;
        }
        
        if (totalCredits === 0) {
            showToast('Please add at least one course', 'error');
            return;
        }
        
        // Calculate semester GPA
        const semesterGpa = totalGradePoints / totalCredits;
        
        // Calculate new CGPA considering retakes
        let newCgpa = semesterGpa;
        let adjustedCompletedCredits = completedCredits;
        let adjustedGradePoints = currentCgpa * completedCredits;
        
        if (completedCredits > 0) {
            // Adjust for retakes
            retakeCourses.forEach(retake => {
                // Subtract the original grade points
                adjustedGradePoints -= retake.originalGpa * retake.credits;
                // Add the new grade points
                adjustedGradePoints += retake.newGpa * retake.credits;
                // Don't add credits again (they were already counted)
            });
            
            newCgpa = (adjustedGradePoints + totalGradePoints) / (completedCredits + totalCredits);
        }
        
        // Cap the CGPA at 4.5
        newCgpa = Math.min(newCgpa, 4.5);
        
        this.semesterGpaDisplay.textContent = semesterGpa.toFixed(2);
        this.newCgpaDisplay.textContent = newCgpa.toFixed(2);
        
        showToast('CGPA calculated successfully!', 'success');
    },
    
    resetCalculator: function() {
        this.currentCgpaInput.value = '';
        this.completedCreditsInput.value = '';
        this.semesterGpaDisplay.textContent = '-';
        this.newCgpaDisplay.textContent = '-';
        this.hasRetakesSelect.value = 'no';
        this.retakesContainer.style.display = 'none';
        
        // Remove all but one course row
        const rows = document.querySelectorAll('.course-row');
        for (let i = 1; i < rows.length; i++) {
            rows[i].remove();
        }
        
        // Reset the first row
        const firstRow = rows[0];
        firstRow.querySelector('.course-grade').value = '';
        firstRow.querySelector('.course-credit').value = '3';
        
        // Remove all but one retake row
        const retakeRows = document.querySelectorAll('.retake-row');
        for (let i = 1; i < retakeRows.length; i++) {
            retakeRows[i].remove();
        }
        
        // Reset the first retake row
        const firstRetakeRow = retakeRows[0];
        if (firstRetakeRow) {
            firstRetakeRow.querySelector('.retake-code').value = '';
            firstRetakeRow.querySelector('.retake-original-gpa').value = '';
            firstRetakeRow.querySelector('.retake-credits').value = '';
            firstRetakeRow.querySelector('.retake-new-gpa').value = '';
        }
        
        showToast('Calculator reset', 'info');
    },
    
    printResults: function() {
        const retakeCourses = this.hasRetakesSelect.value === 'yes' ? this.getRetakeCourses() : [];
        
        const printContent = `
            <h2>EWU CGPA Calculation Result</h2>
            <p><strong>Current CGPA:</strong> ${this.currentCgpaInput.value || 'N/A'}</p>
            <p><strong>Completed Credits:</strong> ${this.completedCreditsInput.value || '0'}</p>
            
            ${retakeCourses.length > 0 ? `
                <h3>Retaken Courses</h3>
                <table class="retake-table">
                    <tr>
                        <th>Course</th>
                        <th>Original GPA</th>
                        <th>Credits</th>
                        <th>Retake GPA</th>
                    </tr>
                    ${retakeCourses.map(retake => `
                        <tr>
                            <td>${retake.code}</td>
                            <td>${retake.originalGpa.toFixed(2)}</td>
                            <td>${retake.credits}</td>
                            <td>${retake.newGpa.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </table>
            ` : ''}
            
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
            <p><small>Note: EWU follows a 4.5 grading scale (A+ = 4.0, A = 3.75, A- = 3.5, B+ = 3.25, B = 3.0, B- = 2.75, C+ = 2.5, C = 2.25, D = 2.0, F = 0.0)</small></p>
            ${retakeCourses.length > 0 ? '<p><small>Note: Retake courses replace the original grade in CGPA calculation</small></p>' : ''}
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
                        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        small { font-size: 0.8em; color: #666; }
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


    // Course Flow Charts Functionality
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

    // Tuition Fee Calculator Functionality
    const feeCalculator = {
        init: function() {
            this.cacheElements();
            this.bindEvents();
            this.loadFeeStructure();
        },
        
        cacheElements: function() {
            this.departmentSelect = document.getElementById('fee-department');
            this.semesterTypeSelect = document.getElementById('semester-type');
            this.coursesContainer = document.getElementById('fee-courses-container');
            this.addCourseBtn = document.getElementById('add-course-fee');
            this.registrationFeeInput = document.getElementById('registration-fee');
            this.libraryFeeInput = document.getElementById('library-fee');
            this.activityFeeInput = document.getElementById('activity-fee');
            this.scholarshipInput = document.getElementById('scholarship');
            this.calculateBtn = document.getElementById('calculate-fee');
            this.resetBtn = document.getElementById('reset-fee');
            this.printBtn = document.getElementById('print-fee');
            
            // Result displays
            this.totalCreditsDisplay = document.getElementById('total-credits');
            this.tuitionFeeDisplay = document.getElementById('tuition-fee');
            this.otherFeesDisplay = document.getElementById('other-fees');
            this.scholarshipDisplay = document.getElementById('scholarship-amount');
            this.totalFeeDisplay = document.getElementById('total-fee');
            this.courseFeeDetails = document.getElementById('course-fee-details');
        },
        
        bindEvents: function() {
            this.addCourseBtn.addEventListener('click', this.addCourse.bind(this));
            this.calculateBtn.addEventListener('click', this.calculateFees.bind(this));
            this.resetBtn.addEventListener('click', this.resetCalculator.bind(this));
            this.printBtn.addEventListener('click', this.printFeeDetails.bind(this));
            
            // Auto-fill per credit fee when department changes
            this.departmentSelect.addEventListener('change', this.updatePerCreditFees.bind(this));
            this.semesterTypeSelect.addEventListener('change', this.updatePerCreditFees.bind(this));
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
        
        addCourse: function() {
            const courseRow = document.createElement('div');
            courseRow.className = 'course-fee-row';
            
            courseRow.innerHTML = `
                <div class="form-group">
                    <label>Course Code:</label>
                    <input type="text" class="course-code" placeholder="e.g., CSE101">
                </div>
                <div class="form-group">
                    <label>Credits:</label>
                    <input type="number" class="course-credit" min="1" max="4" value="3">
                </div>
                <div class="form-group">
                    <label>Per Credit Fee:</label>
                    <input type="number" class="course-per-credit" min="0" placeholder="Auto from dept">
                </div>
                <button class="remove-course-fee"><i class="fas fa-trash"></i></button>
            `;
            
            // Set default per credit fee if department is selected
            const department = this.departmentSelect.value;
            const semesterType = this.semesterTypeSelect.value;
            if (department && semesterType) {
                const perCredit = this.feeStructure[department][semesterType].perCredit;
                courseRow.querySelector('.course-per-credit').value = perCredit;
            }
            
            courseRow.querySelector('.remove-course-fee').addEventListener('click', function() {
                if (document.querySelectorAll('.course-fee-row').length > 1) {
                    courseRow.remove();
                } else {
                    showToast('You need at least one course', 'error');
                }
            });
            
            this.coursesContainer.appendChild(courseRow);
        },
        
        updatePerCreditFees: function() {
            const department = this.departmentSelect.value;
            const semesterType = this.semesterTypeSelect.value;
            
            if (!department || !semesterType) return;
            
            const perCredit = this.feeStructure[department][semesterType].perCredit;
            
            // Update all empty per credit fields
            document.querySelectorAll('.course-per-credit').forEach(input => {
                if (!input.value || input.value === "0") {
                    input.value = perCredit;
                }
            });
        },
        
        calculateFees: function() {
            const department = this.departmentSelect.value;
            const semesterType = this.semesterTypeSelect.value;
            const scholarship = parseInt(this.scholarshipInput.value) || 0;
            
            if (!department) {
                showToast('Please select your department', 'error');
                return;
            }
            
            // Calculate total credits and tuition fee
            let totalCredits = 0;
            let tuitionFee = 0;
            const courses = [];
            
            document.querySelectorAll('.course-fee-row').forEach(row => {
                const code = row.querySelector('.course-code').value.trim();
                const credits = parseFloat(row.querySelector('.course-credit').value) || 0;
                const perCredit = parseFloat(row.querySelector('.course-per-credit').value) || 0;
                
                if (code && credits > 0 && perCredit > 0) {
                    totalCredits += credits;
                    const courseFee = credits * perCredit;
                    tuitionFee += courseFee;
                    
                    courses.push({
                        code,
                        credits,
                        perCredit,
                        courseFee
                    });
                }
            });
            
            if (totalCredits === 0) {
                showToast('Please add at least one valid course', 'error');
                return;
            }
            
            if (scholarship < 0 || scholarship > 100) {
                showToast('Scholarship must be between 0 and 100', 'error');
                return;
            }
            
            // Other fees (not affected by scholarship)
            const registrationFee = parseFloat(this.registrationFeeInput.value) || 0;
            const libraryFee = parseFloat(this.libraryFeeInput.value) || 0;
            const activityFee = parseFloat(this.activityFeeInput.value) || 0;
            const otherFees = registrationFee + libraryFee + activityFee;
            
            // Scholarship only applies to tuition fee
            const scholarshipAmount = (tuitionFee * scholarship) / 100;
            const totalFee = (tuitionFee + otherFees) - scholarshipAmount;
            
            // Update displays
            this.totalCreditsDisplay.textContent = totalCredits;
            this.tuitionFeeDisplay.textContent = `${tuitionFee.toLocaleString()} BDT`;
            this.otherFeesDisplay.textContent = `${otherFees.toLocaleString()} BDT`;
            this.scholarshipDisplay.textContent = `${scholarshipAmount.toLocaleString()} BDT (${scholarship}%)`;
            this.totalFeeDisplay.textContent = `${totalFee.toLocaleString()} BDT`;
            
            // Show course details
            this.showCourseDetails(courses);
            
            showToast('Fees calculated successfully!', 'success');
        },
        
        showCourseDetails: function(courses) {
            let html = '';
            
            if (courses.length === 0) {
                html = '<p>No courses added</p>';
            } else {
                html = '<table class="fee-course-table">';
                html += '<tr><th>Course</th><th>Credits</th><th>Per Credit</th><th>Fee</th></tr>';
                
                courses.forEach(course => {
                    html += `
                        <tr>
                            <td>${course.code}</td>
                            <td>${course.credits}</td>
                            <td>${course.perCredit.toLocaleString()} BDT</td>
                            <td>${course.courseFee.toLocaleString()} BDT</td>
                        </tr>
                    `;
                });
                
                html += '</table>';
            }
            
            this.courseFeeDetails.innerHTML = html;
        },
        
        resetCalculator: function() {
            this.departmentSelect.value = '';
            this.semesterTypeSelect.value = 'regular';
            this.registrationFeeInput.value = '5000';
            this.libraryFeeInput.value = '2000';
            this.activityFeeInput.value = '1500';
            this.scholarshipInput.value = '0';
            
            // Remove all but one course row
            const rows = document.querySelectorAll('.course-fee-row');
            for (let i = 1; i < rows.length; i++) {
                rows[i].remove();
            }
            
            // Reset the first row
            const firstRow = rows[0];
            firstRow.querySelector('.course-code').value = '';
            firstRow.querySelector('.course-credit').value = '3';
            firstRow.querySelector('.course-per-credit').value = '';
            
            // Reset results
            this.totalCreditsDisplay.textContent = '-';
            this.tuitionFeeDisplay.textContent = '-';
            this.otherFeesDisplay.textContent = '-';
            this.scholarshipDisplay.textContent = '-';
            this.totalFeeDisplay.textContent = '-';
            this.courseFeeDetails.innerHTML = '';
            
            showToast('Calculator reset', 'info');
        },
        
        printFeeDetails: function() {
            const department = this.departmentSelect.options[this.departmentSelect.selectedIndex].text;
            const semesterType = this.semesterTypeSelect.options[this.semesterTypeSelect.selectedIndex].text;
            
            const printContent = `
                <h2>EWU Fee Calculation</h2>
                <div class="print-header">
                    <p><strong>Department:</strong> ${department}</p>
                    <p><strong>Semester Type:</strong> ${semesterType}</p>
                </div>
                
                <h3>Course Details</h3>
                ${this.courseFeeDetails.innerHTML}
                
                <h3>Fee Summary</h3>
                <table class="print-fee-summary">
                    <tr>
                        <td>Total Credits:</td>
                        <td>${this.totalCreditsDisplay.textContent}</td>
                    </tr>
                    <tr>
                        <td>Tuition Fee:</td>
                        <td>${this.tuitionFeeDisplay.textContent}</td>
                    </tr>
                    <tr>
                        <td>Other Fees:</td>
                        <td>${this.otherFeesDisplay.textContent}</td>
                    </tr>
                    <tr>
                        <td>Scholarship:</td>
                        <td>${this.scholarshipDisplay.textContent}</td>
                    </tr>
                    <tr class="total">
                        <td>Total Payable:</td>
                        <td>${this.totalFeeDisplay.textContent}</td>
                    </tr>
                </table>
                
                <div class="print-footer">
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
                </div>
            `;
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>EWU Fee Calculation</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h2, h3 { color: #0056b3; }
                            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            .print-header { margin-bottom: 20px; }
                            .print-fee-summary { width: 60%; }
                            .print-fee-summary tr.total { font-weight: bold; }
                            .print-footer { margin-top: 30px; text-align: center; font-size: 0.9em; color: #666; }
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

    // Routine Generator Functionality
// Routine Generator Functionality with Section Support
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
        this.sectionInput = document.getElementById('course-section');
        this.theorySessionsContainer = document.getElementById('theory-sessions-container');
        this.labSessionContainer = document.getElementById('lab-session-container');
        this.facultyInput = document.getElementById('faculty-name');
        this.roomInput = document.getElementById('room-number');
        this.addCourseBtn = document.getElementById('add-course-btn');
        this.courseList = document.getElementById('course-list');
        this.routineDisplay = document.getElementById('routine-display');
        this.generateBtn = document.getElementById('generate-routine');
        this.downloadBtn = document.getElementById('download-routine');
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
        this.downloadBtn.addEventListener('click', this.downloadRoutineAsImage.bind(this));
        this.printBtn.addEventListener('click', this.printRoutine.bind(this));
        this.clearBtn.addEventListener('click', this.clearAll.bind(this));
    },
    
    setupCourseTypeToggle: function() {
        this.courseTypeInput.addEventListener('change', () => {
            if (this.courseTypeInput.value === 'lab') {
                this.theorySessionsContainer.style.display = 'none';
                this.labSessionContainer.style.display = 'block';
                this.labDuration.value = '1.5';
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
        const section = this.sectionInput.value;
        const faculty = this.facultyInput.value.trim();
        const room = this.roomInput.value.trim();
        
        if (!code || !title || !faculty) {
            showToast('Please fill all required fields', 'error');
            return;
        }
        
        const sessions = [];
        if (type === 'lab') {
            const day = this.labDay.value;
            const time = this.labTime.value;
            const duration = parseFloat(this.labDuration.value);
            
            if (!day || !time || isNaN(duration)) {
                showToast('Please fill all lab session details', 'error');
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
                showToast('Please add at least one class session', 'error');
                return;
            }
        }
        
        const course = {
            id: Date.now(),
            code,
            title,
            type,
            section,
            faculty,
            room,
            sessions
        };
        
        this.courses.push(course);
        this.renderCourseList();
        this.clearForm();
        showToast('Course added successfully!', 'success');
        
        // Auto-generate routine when courses are added
        if (this.courses.length > 0) {
            this.generateRoutine();
        }
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
                        <span class="course-item-section">Sec ${course.section}</span>
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
        showToast('Course deleted', 'info');
        
        // Regenerate routine after deletion
        if (this.courses.length > 0) {
            this.generateRoutine();
        } else {
            this.clearRoutineDisplay();
        }
    },
    
    editCourse: function(id) {
        const course = this.courses.find(c => c.id === id);
        if (!course) return;
        
        this.courseCodeInput.value = course.code;
        this.courseTitleInput.value = course.title;
        this.courseTypeInput.value = course.type;
        this.sectionInput.value = course.section;
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
        this.sectionInput.value = '1';
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
        this.labDuration.value = '1.5';
        
        this.courseCodeInput.focus();
    },
    
  // Update the generateRoutine function in the routineGenerator object
    generateRoutine: function() {
        if (this.courses.length === 0) {
            this.clearRoutineDisplay();
            return;
        }

        const days = [
            { name: 'Sunday', abbr: 'Sun' },
            { name: 'Monday', abbr: 'Mon' },
            { name: 'Tuesday', abbr: 'Tue' },
            { name: 'Wednesday', abbr: 'Wed' },
            { name: 'Thursday', abbr: 'Thu' }
        ];

        // Time slots with proper formatting
        const timeSlots = [
            { start: '8:30', end: '10:00', label: '8:30-10:00' },
            { start: '10:10', end: '11:40', label: '10:10-11:40' },
            { start: '11:50', end: '13:20', label: '11:50-1:20' },
            { start: '13:30', end: '15:00', label: '1:30-3:00' },
            { start: '15:10', end: '16:40', label: '3:10-4:40' },
            { start: '16:50', end: '18:20', label: '4:50-6:20' }
        ];

        // Create a grid to represent the routine table
        const routineGrid = days.map(() => {
            return timeSlots.map(() => ({
                courses: [],
                rendered: false,
                rowspan: 1,
                hasConflict: false
            }));
        });

        // Track faculty schedules for conflict detection
        const facultySchedules = {};
        const roomSchedules = {};

        // First pass: Populate the grid and detect conflicts
        this.courses.forEach(course => {
            course.sessions.forEach(session => {
                const dayIndex = days.findIndex(d => d.name === session.day);
                if (dayIndex === -1) return;

                const sessionStart = this.timeToMinutes(session.time);
                const sessionEnd = sessionStart + (session.duration * 60);

                // Find the best matching time slot
                let bestSlotIndex = -1;
                let bestOverlap = 0;
                
                timeSlots.forEach((slot, slotIndex) => {
                    const slotStart = this.timeToMinutes(slot.start);
                    const slotEnd = this.timeToMinutes(slot.end);
                    
                    // Calculate overlap
                    const overlapStart = Math.max(sessionStart, slotStart);
                    const overlapEnd = Math.min(sessionEnd, slotEnd);
                    const overlap = Math.max(0, overlapEnd - overlapStart);
                    
                    if (overlap > bestOverlap) {
                        bestOverlap = overlap;
                        bestSlotIndex = slotIndex;
                    }
                });

                if (bestSlotIndex !== -1) {
                    // Calculate how many slots this session spans
                    const slotDuration = this.timeToMinutes(timeSlots[bestSlotIndex].end) - 
                                        this.timeToMinutes(timeSlots[bestSlotIndex].start);
                    const rowspan = Math.ceil(session.duration * 60 / slotDuration);
                    
                    // Track faculty schedule
                    if (!facultySchedules[course.faculty]) {
                        facultySchedules[course.faculty] = [];
                    }
                    facultySchedules[course.faculty].push({
                        day: dayIndex,
                        slot: bestSlotIndex,
                        rowspan,
                        courseCode: course.code
                    });

                    // Track room schedule
                    if (course.room) {
                        if (!roomSchedules[course.room]) {
                            roomSchedules[course.room] = [];
                        }
                        roomSchedules[course.room].push({
                            day: dayIndex,
                            slot: bestSlotIndex,
                            rowspan,
                            courseCode: course.code
                        });
                    }

                    routineGrid[dayIndex][bestSlotIndex].courses.push({
                        course,
                        session,
                        rowspan
                    });
                    routineGrid[dayIndex][bestSlotIndex].rowspan = rowspan;
                }
            });
        });

        // Second pass: Detect conflicts
        // Faculty conflicts
        Object.entries(facultySchedules).forEach(([faculty, schedules]) => {
            if (schedules.length > 1) {
                // Check for overlapping schedules
                const facultyConflicts = this.findConflicts(schedules);
                facultyConflicts.forEach(conflict => {
                    conflict.slots.forEach(slot => {
                        routineGrid[conflict.day][slot].hasConflict = true;
                    });
                });
            }
        });

        // Room conflicts
        Object.entries(roomSchedules).forEach(([room, schedules]) => {
            if (schedules.length > 1) {
                const roomConflicts = this.findConflicts(schedules);
                roomConflicts.forEach(conflict => {
                    conflict.slots.forEach(slot => {
                        routineGrid[conflict.day][slot].hasConflict = true;
                    });
                });
            }
        });

        // Generate HTML from the grid
        let html = `
            <div class="routine-table-container">
                <table class="routine-table">
                    <thead>
                        <tr>
                            <th class="day-col">Day/Time</th>
                            ${timeSlots.map(slot => `<th>${this.formatTimeLabel(slot.label)}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;

        days.forEach((day, dayIndex) => {
            html += `<tr><td class="day-col">${day.abbr}</td>`;
            
            timeSlots.forEach((slot, slotIndex) => {
                const cell = routineGrid[dayIndex][slotIndex];
                
                if (cell.rendered || cell.courses.length === 0) {
                    html += cell.rendered ? '' : '<td></td>';
                    return;
                }

                // Take the first course (we've already matched them properly)
                const courseData = cell.courses[0];
                if (!courseData) {
                    html += '<td></td>';
                    return;
                }

                const { course, session } = courseData;
                const isLab = course.type === 'lab';
                const roomPrefix = isLab ? 'Lab' : 'R';
                const sectionInfo = isLab ? 'Lab' : `Sec ${course.section}`;
                const conflictClass = cell.hasConflict ? 'conflict-slot' : '';

                // Mark subsequent slots as rendered
                for (let i = 1; i < cell.rowspan; i++) {
                    if (slotIndex + i < timeSlots.length) {
                        routineGrid[dayIndex][slotIndex + i].rendered = true;
                    }
                }

                html += `
                    <td class="course-slot ${conflictClass}" rowspan="${cell.rowspan}" 
                        data-day="${dayIndex}" data-slot="${slotIndex}" 
                        data-course-id="${course.id}" draggable="true">
                        <div class="course-block ${isLab ? 'lab-block' : 'theory-block'}">
                            <div class="course-code">${course.code} <span class="course-section">${sectionInfo}</span></div>
                            <div class="course-room">${roomPrefix}: ${course.room || 'N/A'}</div>
                            <div class="course-faculty">${course.faculty || ''}</div>
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
            
            <!-- Export Buttons -->
            <div class="export-buttons">
                <button id="export-ical" class="btn export-btn">
                    <i class="fas fa-calendar-plus"></i> Export to iCal
                </button>
                <button id="export-pdf" class="btn export-btn">
                    <i class="fas fa-file-pdf"></i> Export as PDF
                </button>
            </div>
            
            <!-- Conflict Warnings -->
            <div id="conflict-warnings"></div>
        `;

        this.routineDisplay.innerHTML = html;
        this.printBtn.disabled = false;
        this.downloadBtn.disabled = false;
        
        // Add drag and drop functionality
        this.setupDragAndDrop();
        
        // Add export button event listeners
        document.getElementById('export-ical')?.addEventListener('click', this.exportToICal.bind(this));
        document.getElementById('export-pdf')?.addEventListener('click', this.exportToPDF.bind(this));
        
        // Show conflict warnings if any
        this.showConflictWarnings(routineGrid);
    },

    findConflicts: function(schedules) {
        // Group by day
        const conflicts = [];
        const days = {};
        
        schedules.forEach(schedule => {
            if (!days[schedule.day]) {
                days[schedule.day] = [];
            }
            days[schedule.day].push(schedule);
        });
        
        // Check for overlapping slots on each day
        Object.entries(days).forEach(([day, daySchedules]) => {
            if (daySchedules.length > 1) {
                // Sort by slot
                daySchedules.sort((a, b) => a.slot - b.slot);
                
                // Check for overlaps
                for (let i = 0; i < daySchedules.length - 1; i++) {
                    const current = daySchedules[i];
                    const next = daySchedules[i + 1];
                    
                    if (next.slot < current.slot + current.rowspan) {
                        // Conflict found
                        const conflict = {
                            day: parseInt(day),
                            slots: [],
                            courses: []
                        };
                        
                        // Add all overlapping slots
                        const startSlot = Math.min(current.slot, next.slot);
                        const endSlot = Math.max(current.slot + current.rowspan, next.slot + next.rowspan);
                        
                        for (let s = startSlot; s < endSlot; s++) {
                            conflict.slots.push(s);
                        }
                        
                        conflict.courses.push(current.courseCode, next.courseCode);
                        conflicts.push(conflict);
                    }
                }
            }
        });
        
        return conflicts;
    },

    showConflictWarnings: function(routineGrid) {
        const warningsContainer = document.getElementById('conflict-warnings');
        if (!warningsContainer) return;
        
        let hasConflicts = false;
        let warningHTML = '<h3>Schedule Warnings</h3><ul>';
        
        // Check for faculty conflicts
        const facultyMap = {};
        this.courses.forEach(course => {
            if (!facultyMap[course.faculty]) {
                facultyMap[course.faculty] = [];
            }
            facultyMap[course.faculty].push(course);
        });
        
        Object.entries(facultyMap).forEach(([faculty, courses]) => {
            if (courses.length > 1) {
                // Check if any of these courses have conflicts
                let facultyHasConflict = false;
                const conflictCourses = [];
                
                courses.forEach(course => {
                    course.sessions.forEach(session => {
                        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].indexOf(session.day);
                        if (dayIndex === -1) return;
                        
                        const sessionStart = this.timeToMinutes(session.time);
                        const sessionEnd = sessionStart + (session.duration * 60);
                        
                        // Check if this session overlaps with any other session for this faculty
                        courses.forEach(otherCourse => {
                            if (otherCourse.id === course.id) return;
                            
                            otherCourse.sessions.forEach(otherSession => {
                                const otherDayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].indexOf(otherSession.day);
                                if (otherDayIndex !== dayIndex) return;
                                
                                const otherStart = this.timeToMinutes(otherSession.time);
                                const otherEnd = otherStart + (otherSession.duration * 60);
                                
                                if (sessionStart < otherEnd && sessionEnd > otherStart) {
                                    // Conflict found
                                    facultyHasConflict = true;
                                    if (!conflictCourses.includes(course.code)) {
                                        conflictCourses.push(course.code);
                                    }
                                    if (!conflictCourses.includes(otherCourse.code)) {
                                        conflictCourses.push(otherCourse.code);
                                    }
                                }
                            });
                        });
                    });
                });
                
                if (facultyHasConflict) {
                    hasConflicts = true;
                    warningHTML += `<li>
                        <i class="fas fa-exclamation-triangle"></i> 
                        <strong>Faculty Conflict:</strong> ${faculty} is scheduled for multiple classes at the same time (${conflictCourses.join(', ')})
                    </li>`;
                }
            }
        });
        
        // Check for room conflicts
        const roomMap = {};
        this.courses.forEach(course => {
            if (!course.room) return;
            if (!roomMap[course.room]) {
                roomMap[course.room] = [];
            }
            roomMap[course.room].push(course);
        });
        
        Object.entries(roomMap).forEach(([room, courses]) => {
            if (courses.length > 1) {
                let roomHasConflict = false;
                const conflictCourses = [];
                
                courses.forEach(course => {
                    course.sessions.forEach(session => {
                        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].indexOf(session.day);
                        if (dayIndex === -1) return;
                        
                        const sessionStart = this.timeToMinutes(session.time);
                        const sessionEnd = sessionStart + (session.duration * 60);
                        
                        courses.forEach(otherCourse => {
                            if (otherCourse.id === course.id) return;
                            
                            otherCourse.sessions.forEach(otherSession => {
                                const otherDayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].indexOf(otherSession.day);
                                if (otherDayIndex !== dayIndex) return;
                                
                                const otherStart = this.timeToMinutes(otherSession.time);
                                const otherEnd = otherStart + (otherSession.duration * 60);
                                
                                if (sessionStart < otherEnd && sessionEnd > otherStart) {
                                    // Conflict found
                                    roomHasConflict = true;
                                    if (!conflictCourses.includes(course.code)) {
                                        conflictCourses.push(course.code);
                                    }
                                    if (!conflictCourses.includes(otherCourse.code)) {
                                        conflictCourses.push(otherCourse.code);
                                    }
                                }
                            });
                        });
                    });
                });
                
                if (roomHasConflict) {
                    hasConflicts = true;
                    warningHTML += `<li>
                        <i class="fas fa-exclamation-triangle"></i> 
                        <strong>Room Conflict:</strong> Room ${room} has multiple classes scheduled at the same time (${conflictCourses.join(', ')})
                    </li>`;
                }
            }
        });
        
        warningHTML += '</ul>';
        
        if (!hasConflicts) {
            warningHTML = '<div class="no-conflicts"><i class="fas fa-check-circle"></i> No schedule conflicts detected</div>';
        }
        
        warningsContainer.innerHTML = warningHTML;
    },

    setupDragAndDrop: function() {
        const slots = document.querySelectorAll('.course-slot');
        let draggedSlot = null;

        slots.forEach(slot => {
            slot.addEventListener('dragstart', (e) => {
                draggedSlot = slot;
                e.dataTransfer.setData('text/plain', slot.dataset.courseId);
                setTimeout(() => {
                    slot.style.opacity = '0.4';
                }, 0);
            });

            slot.addEventListener('dragend', () => {
                slot.style.opacity = '1';
                draggedSlot = null;
            });

            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (draggedSlot !== slot) {
                    slot.style.backgroundColor = 'rgba(0, 206, 201, 0.2)';
                }
            });

            slot.addEventListener('dragleave', () => {
                slot.style.backgroundColor = '';
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.style.backgroundColor = '';
                
                if (draggedSlot && draggedSlot !== slot) {
                    const courseId = parseInt(e.dataTransfer.getData('text/plain'));
                    const targetDay = parseInt(slot.dataset.day);
                    const targetSlot = parseInt(slot.dataset.slot);
                    
                    // Find the course
                    const course = this.courses.find(c => c.id === courseId);
                    if (!course) return;
                    
                    // Update the course session time based on the new slot
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
                    const timeSlots = [
                        { start: '8:30', end: '10:00' },
                        { start: '10:10', end: '11:40' },
                        { start: '11:50', end: '13:20' },
                        { start: '13:30', end: '15:00' },
                        { start: '15:10', end: '16:40' },
                        { start: '16:50', end: '18:20' }
                    ];
                    
                    // Update the course session
                    course.sessions.forEach(session => {
                        session.day = days[targetDay];
                        session.time = timeSlots[targetSlot].start;
                        
                        // Calculate duration based on rowspan
                        const rowspan = parseInt(slot.getAttribute('rowspan') || 1);
                        const slotDuration = this.timeToMinutes(timeSlots[targetSlot].end) - 
                                           this.timeToMinutes(timeSlots[targetSlot].start);
                        session.duration = (rowspan * slotDuration) / 60;
                    });
                    
                    // Regenerate the routine
                    this.generateRoutine();
                }
            });
        });
    },

 

    // Helper functions
    getNextDayOfWeek: function(dayName) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = days.indexOf(dayName);
        if (dayIndex === -1) return null;

        const today = new Date();
        const result = new Date(today);
        result.setDate(today.getDate() + ((dayIndex - today.getDay() + 7) % 7));
        return result;
    },

    formatICalDate: function(date) {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z/, 'Z');
    },

    formatTimeLabel: function(label) {
        // Always show full format (8:30-10:00) even on mobile
        return label;
    },


    
    clearRoutineDisplay: function() {
        this.routineDisplay.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-calendar"></i>
                <p>Your generated routine will appear here</p>
            </div>
        `;
        this.printBtn.disabled = true;
        this.downloadBtn.disabled = true;
    },

    timeToMinutes: function(timeString) {
        // Handle both "HH:MM" and "H:MM" formats
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    },
    
printRoutine: function() {
    if (this.courses.length === 0) {
        showToast('No routine to print', 'error');
        return;
    }

    const printContent = this.routineDisplay.innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Class Routine</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; }
                    .routine-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .routine-table th, .routine-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                    .routine-table th { background-color: #0056b3; color: white; }
                    .routine-table .day-col { background-color: #f1f1f1; font-weight: bold; width: 80px; }
                    .course-block { background-color: #e7f5ff; border-radius: 4px; padding: 5px; margin: 2px; }
                    .lab-block { background-color: #fff3bf; }
                    .course-code { font-weight: bold; font-size: 0.9rem; }
                    .course-section {
                        font-size: 0.7rem;
                        background-color: #0056b3;
                        color: white;
                        padding: 1px 4px;
                        border-radius: 3px;
                    }
                    .course-room { font-size: 0.8rem; }
                    .course-faculty { font-size: 0.8rem; font-style: italic; }
                    h1 { color: #0056b3; text-align: center; margin-bottom: 5px; }
                    .print-header { margin-bottom: 20px; }
                    .print-footer { text-align: center; margin-top: 20px; font-size: 0.8rem; color: #666; }
                    
                    @media print {
                        body { padding: 10px; }
                        .routine-table { font-size: 10pt; }
                        .routine-table th, .routine-table td { padding: 4px; }
                        .course-code { font-size: 0.8rem; }
                        .course-room, .course-faculty { font-size: 0.7rem; }
                    }
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
                        setTimeout(function() { 
                            window.print(); 
                            setTimeout(function() { window.close(); }, 1000);
                        }, 300);
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
        this.clearRoutineDisplay();
        showToast('All courses cleared', 'info');
    },

    downloadRoutineAsImage: function() {
        if (this.courses.length === 0) {
            showToast('Please generate a routine first', 'error');
            return;
        }

        const routineContainer = document.querySelector('.routine-table-container');
        
        if (!routineContainer) {
            showToast('No routine to download', 'error');
            return;
        }

        showToast('Generating image... please wait', 'info');
        
        // Store original styles
        const originalOverflow = routineContainer.style.overflow;
        const originalWidth = routineContainer.style.width;
        
        // Temporarily adjust styles for capture
        routineContainer.style.overflow = 'visible';
        routineContainer.style.width = 'fit-content';
        
        // Temporarily hide the print button to avoid it appearing in the image
        const printBtn = document.getElementById('print-routine');
        const originalDisplay = printBtn.style.display;
        printBtn.style.display = 'none';

        html2canvas(routineContainer, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: routineContainer.scrollWidth,
            windowHeight: routineContainer.scrollHeight,
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--card-bg')
        }).then(canvas => {
            // Restore original styles
            routineContainer.style.overflow = originalOverflow;
            routineContainer.style.width = originalWidth;
            printBtn.style.display = originalDisplay;

            // Create download link
            const link = document.createElement('a');
            link.download = 'EWU_Routine_' + new Date().toISOString().slice(0, 10) + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            showToast('Routine downloaded as image', 'success');
        }).catch(err => {
            // Restore original styles
            routineContainer.style.overflow = originalOverflow;
            routineContainer.style.width = originalWidth;
            printBtn.style.display = originalDisplay;
            
            console.error('Error generating image:', err);
            showToast('Failed to generate image', 'error');
        });
    }
};

    

    // Toast notification function
    function showToast(message, type) {
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