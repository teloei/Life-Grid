// 语言文本对象
const translations = {
  zh: {
    // 网站标题和介绍
    siteTitle: "生命网格",
    siteDescription: "生命网格是一款极简主义的网页应用，帮助你直观地规划你的时间。输入你的年龄和期望寿命，它就能显示时间流逝和剩余时间，鼓励你反思并更有针对性地生活。今天就开始规划你的时间吧！",
    
    // 顶部卡片
    birthDateSet: "已设置出生日期",
    changeBirthDate: "更改出生日期",
    currentYear: "当前年份:",
    yourAge: "你的年龄:",
    yearsOld: "岁",
    currentSlot: "当前30分钟时段",
    slotsPassed: "个时段已过",
    slotsText: "今天已过",
    
    // 剩余时间区域
    whatsLeftForYear: "本年剩余时间",
    whatsLeftForToday: "今日剩余时间",
    remainingPrimeTime: "剩余黄金时间",
    daysLeft: "剩余天数",
    weeksLeft: "剩余周数",
    monthsLeft: "剩余月数",
    hoursLeft: "剩余小时",
    minutesLeft: "剩余分钟",
    secondsLeft: "剩余秒数",
    yearsLeft: "剩余年数",
    
    // 可视化区域
    weeksRemainingThisYear: "本年剩余周数",
    hoursRemainingToday: "今日剩余小时",
    primeYearsRemaining: "剩余黄金年",
    activeHours: "活跃时间 (上午6点 - 晚上9点)",
    monthsRemainingThisYear: "本年剩余月数",
    
    // 生命进度
    lifeProgress: "人生进度",
    overallLifeProgressYears: "总体人生进度 (年)",
    primeYearsProgress: "黄金年进度 (月)",
    overallLifeProgressMonths: "总体人生进度 (月)",
    
    // 模态框
    setBirthDate: "设置出生日期",
    birthDate: "出生日期:",
    expectedLifespan: "预期寿命 (年):",
    save: "保存"
  },
  en: {
    // 网站标题和介绍
    siteTitle: "Life Grid",
    siteDescription: "Life Grid is a minimalist web application that helps you visually plan your time. Enter your age and expected lifespan, and it will show you the time elapsed and remaining, encouraging you to reflect and live more purposefully. Start planning your time today!",
    
    // 顶部卡片
    birthDateSet: "Birth Date Set",
    changeBirthDate: "Change Birth Date",
    currentYear: "Current Year:",
    yourAge: "Your Age:",
    yearsOld: "years old",
    currentSlot: "Current 30-Min Slot",
    slotsPassed: "slots passed today",
    slotsText: "",
    
    // 剩余时间区域
    whatsLeftForYear: "What's left for 2025",
    whatsLeftForToday: "What's left for today",
    remainingPrimeTime: "Remaining Prime Time",
    daysLeft: "Days Left",
    weeksLeft: "Weeks Left",
    monthsLeft: "Months Left",
    hoursLeft: "Hours Left",
    minutesLeft: "Minutes Left",
    secondsLeft: "Seconds Left",
    yearsLeft: "Years Left",
    
    // 可视化区域
    weeksRemainingThisYear: "Weeks Remaining This Year",
    hoursRemainingToday: "Hours Remaining Today",
    primeYearsRemaining: "Prime Years Remaining",
    activeHours: "Active Hours (6 AM - 9 PM)",
    monthsRemainingThisYear: "Months Remaining This Year",
    
    // 生命进度
    lifeProgress: "Life Progress",
    overallLifeProgressYears: "Overall Life Progress (Years)",
    primeYearsProgress: "Prime Years Progress (Months)",
    overallLifeProgressMonths: "Overall Life Progress (Months)",
    
    // 模态框
    setBirthDate: "Set Birth Date",
    birthDate: "Birth Date:",
    expectedLifespan: "Expected Lifespan (years):",
    save: "Save"
  }
};

// 当前语言
let currentLanguage = 'zh';

document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const changeBirthBtn = document.getElementById('change-birth-btn');
    const birthdayModal = document.getElementById('birthday-modal');
    const closeBtn = document.querySelector('.close-btn');
    const saveBirthdayBtn = document.getElementById('save-birthday-btn');
    const birthDateInput = document.getElementById('birth-date');
    const lifespanInput = document.getElementById('expected-lifespan');
    const languageSelect = document.getElementById('language-select');
    
    // 初始化数据
    let birthDate = localStorage.getItem('birthDate') ? new Date(localStorage.getItem('birthDate')) : new Date(2000, 3, 19); // 默认2000年4月19日
    let expectedLifespan = localStorage.getItem('expectedLifespan') ? parseInt(localStorage.getItem('expectedLifespan')) : 80;
    
    // 设置初始生日输入值
    if (localStorage.getItem('birthDate')) {
        birthDateInput.value = localStorage.getItem('birthDate').split('T')[0];
    } else {
        const defaultDate = new Date(2000, 3, 19);
        birthDateInput.value = formatDateForInput(defaultDate);
    }
    
    lifespanInput.value = expectedLifespan;
    
    // 初始化语言
    initializeLanguage();
    
    // 初始化当前日期和时间
    updateDateTime();
    // 每秒更新一次时间
    setInterval(updateDateTime, 1000);
    
    // 初始化各种可视化
    initializeVisualizations();
    
    // 计算并显示各种剩余时间
    calculateRemainingTime();
    // 每分钟更新一次剩余时间
    setInterval(calculateRemainingTime, 60000);
    
    // 初始化生命进度条
    initializeProgressBars();
    
    // 打开生日设置模态框
    changeBirthBtn.addEventListener('click', function() {
        birthdayModal.style.display = 'block';
    });
    
    // 关闭模态框
    closeBtn.addEventListener('click', function() {
        birthdayModal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === birthdayModal) {
            birthdayModal.style.display = 'none';
        }
    });
    
    // 保存生日设置
    saveBirthdayBtn.addEventListener('click', function() {
        const newBirthDate = birthDateInput.value;
        const newLifespan = parseInt(lifespanInput.value);
        
        if (!newBirthDate) {
            alert(currentLanguage === 'zh' ? '请输入有效的出生日期' : 'Please enter a valid birth date');
            return;
        }
        
        if (isNaN(newLifespan) || newLifespan <= 0 || newLifespan > 120) {
            alert(currentLanguage === 'zh' ? '请输入1-120之间的有效寿命' : 'Please enter a valid lifespan between 1-120');
            return;
        }
        
        // 保存到本地存储
        localStorage.setItem('birthDate', newBirthDate);
        localStorage.setItem('expectedLifespan', newLifespan);
        
        // 更新全局变量
        birthDate = new Date(newBirthDate);
        expectedLifespan = newLifespan;
        
        // 更新界面
        calculateRemainingTime();
        initializeVisualizations();
        initializeProgressBars();
        
        // 关闭模态框
        birthdayModal.style.display = 'none';
    });
    
    // 语言切换
    languageSelect.addEventListener('change', function() {
        changeLanguage(this.value);
    });
    
    // 初始化语言
    function initializeLanguage() {
        // 获取用户之前选择的语言或浏览器语言
        const savedLanguage = localStorage.getItem('preferredLanguage');
        const browserLanguage = navigator.language || navigator.userLanguage;
        const initialLanguage = savedLanguage || (browserLanguage.startsWith('zh') ? 'zh' : 'en');
        
        // 设置语言选择器的初始值
        languageSelect.value = initialLanguage;
        
        // 应用语言
        changeLanguage(initialLanguage);
    }
    
    // 格式化日期为input[type="date"]可用的格式
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // 更新日期和时间
    function updateDateTime() {
        const now = new Date();
        
        // 更新年份
        document.getElementById('current-year').textContent = now.getFullYear();
        
        // 格式化日期
        const formattedDate = currentLanguage === 'zh' 
            ? `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
            : new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(now);
        document.getElementById('current-date').textContent = formattedDate;
        
        // 更新今日剩余时间标题中的日期
        const todayDateElement = document.querySelector('.remaining-section:nth-child(2) .section-title');
        if (todayDateElement) {
            const todayText = translations[currentLanguage].whatsLeftForToday;
            todayDateElement.innerHTML = `<i class="far fa-clock icon-section"></i> <span>${todayText} (${formattedDate})</span>`;
        }
        
        // 格式化时间
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        let formattedTime;
        if (currentLanguage === 'zh') {
            const ampm = hours < 12 ? '上午' : '下午';
            const displayHours = hours % 12 || 12;
            formattedTime = `${ampm}${displayHours}:${minutes}:${seconds}`;
        } else {
            const ampm = hours < 12 ? 'AM' : 'PM';
            const displayHours = hours % 12 || 12;
            formattedTime = `${displayHours}:${minutes}:${seconds} ${ampm}`;
        }
        document.getElementById('current-time').textContent = formattedTime;
        
        // 计算30分钟时间槽
        const totalMinutes = hours * 60 + now.getMinutes();
        const slotNumber = Math.floor(totalMinutes / 30) + 1;
        document.getElementById('current-slot').textContent = slotNumber + ":02";
        
        // 更新时间槽文本
        const slotsPassedElement = document.querySelector('.slots-passed');
        if (slotsPassedElement) {
            if (currentLanguage === 'zh') {
                slotsPassedElement.innerHTML = `今天已过 <span id="slots-passed">${slotNumber}</span> 个时段`;
            } else {
                slotsPassedElement.innerHTML = `<span id="slots-passed">${slotNumber}</span> slots passed today`;
            }
        }
        
        // 计算年龄
        if (birthDate) {
            const ageDate = new Date(now - birthDate);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);
            document.getElementById('your-age').textContent = age;
        }
    }
    
    // 计算剩余时间
    function calculateRemainingTime() {
        const now = new Date();
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        
        // 计算今年剩余天数
        const daysLeft = Math.ceil((endOfYear - now) / (1000 * 60 * 60 * 24));
        document.getElementById('days-left').textContent = daysLeft;
        
        // 计算今年剩余周数
        const weeksLeft = Math.ceil(daysLeft / 7);
        document.getElementById('weeks-left').textContent = weeksLeft;
        
        // 计算今年剩余月数
        const monthsLeft = 12 - now.getMonth() - 1;
        document.getElementById('months-left').textContent = monthsLeft;
        
        // 计算今天剩余小时数
        const hoursLeft = Math.floor((endOfDay - now) / (1000 * 60 * 60));
        document.getElementById('hours-left').textContent = hoursLeft;
        
        // 计算今天剩余分钟数
        const minutesLeft = Math.floor((endOfDay - now) / (1000 * 60));
        document.getElementById('minutes-left').textContent = minutesLeft;
        
        // 计算今天剩余秒数
        const secondsLeft = Math.floor((endOfDay - now) / 1000);
        document.getElementById('seconds-left').textContent = secondsLeft.toLocaleString();
        
        // 计算黄金时间剩余
        if (birthDate) {
            const ageDate = new Date(now - birthDate);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);
            const primeAgeEnd = 45; // 假设45岁为黄金时间结束
            
            if (age < primeAgeEnd) {
                const primeYearsLeft = primeAgeEnd - age;
                document.getElementById('prime-years-left').textContent = primeYearsLeft;
                document.getElementById('prime-months-left').textContent = Math.round(primeYearsLeft * 12);
                document.getElementById('prime-weeks-left').textContent = Math.round(primeYearsLeft * 52).toLocaleString();
            } else {
                document.getElementById('prime-years-left').textContent = "0";
                document.getElementById('prime-months-left').textContent = "0";
                document.getElementById('prime-weeks-left').textContent = "0";
            }
        }
    }
    
    // 初始化可视化
    function initializeVisualizations() {
        // 初始化周可视化
        initializeWeeksGrid();
        
        // 初始化小时可视化
        initializeHoursGrid();
        
        // 初始化黄金年可视化
        initializePrimeYearsGrid();
        
        // 初始化活跃小时可视化
        initializeActiveHoursGrid();
        
        // 初始化月可视化
        initializeMonthsGrid();
    }
    
    // 初始化周网格
    function initializeWeeksGrid() {
        const weeksGrid = document.getElementById('weeks-grid');
        weeksGrid.innerHTML = '';
        
        const totalWeeks = 52;
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const weeksPassed = Math.floor((now - startOfYear) / (7 * 24 * 60 * 60 * 1000));
        
        document.querySelector('.weeks-remaining .vis-ratio').textContent = `(${totalWeeks - weeksPassed}/${totalWeeks})`;
        
        for (let i = 0; i < totalWeeks; i++) {
            const cell = document.createElement('div');
            cell.className = `grid-cell ${i < weeksPassed ? 'cell-past' : (i === weeksPassed ? 'cell-current' : 'cell-future')}`;
            weeksGrid.appendChild(cell);
        }
    }
    
    // 初始化小时网格
    function initializeHoursGrid() {
        const hoursGrid = document.getElementById('hours-grid');
        hoursGrid.innerHTML = '';
        
        const totalHours = 24;
        const currentHour = new Date().getHours();
        
        document.querySelector('.hours-remaining .vis-ratio').textContent = `(${totalHours - currentHour}/${totalHours})`;
        
        for (let i = 0; i < totalHours; i++) {
            const cell = document.createElement('div');
            if (i < currentHour) {
                cell.className = 'grid-cell cell-past';
            } else if (i === currentHour) {
                cell.className = 'grid-cell cell-current';
            } else {
                cell.className = 'grid-cell cell-future';
            }
            hoursGrid.appendChild(cell);
        }
    }
    
    // 初始化黄金年网格
    function initializePrimeYearsGrid() {
        const primeYearsGrid = document.getElementById('prime-years-grid');
        primeYearsGrid.innerHTML = '';
        
        const totalYears = 45; // 假设45岁为黄金时间结束
        let passedYears = 0;
        
        if (birthDate) {
            const now = new Date();
            const ageDate = new Date(now - birthDate);
            passedYears = Math.abs(ageDate.getUTCFullYear() - 1970);
            if (passedYears > totalYears) passedYears = totalYears;
        }
        
        document.querySelector('.prime-years .vis-ratio').textContent = `(${totalYears - passedYears}/${totalYears})`;
        
        for (let i = 0; i < totalYears; i++) {
            const cell = document.createElement('div');
            cell.className = `grid-cell ${i < passedYears ? 'cell-past' : (i === passedYears ? 'cell-current' : 'cell-future')}`;
            primeYearsGrid.appendChild(cell);
        }
    }
    
    // 初始化活跃小时网格
    function initializeActiveHoursGrid() {
        const activeHoursGrid = document.getElementById('active-hours-grid');
        activeHoursGrid.innerHTML = '';
        
        const startHour = 6; // 6 AM
        const endHour = 21; // 9 PM
        const totalHours = endHour - startHour;
        const currentHour = new Date().getHours();
        
        const activeHoursPassed = Math.max(0, Math.min(currentHour - startHour, totalHours));
        document.querySelector('.active-hours .vis-ratio').textContent = `(${activeHoursPassed}/${totalHours})`;
        
        for (let i = startHour; i < endHour; i++) {
            const cell = document.createElement('div');
            if (i < currentHour) {
                cell.className = 'grid-cell cell-past';
            } else if (i === currentHour) {
                cell.className = 'grid-cell cell-current';
            } else {
                cell.className = 'grid-cell cell-future';
            }
            activeHoursGrid.appendChild(cell);
        }
    }
    
    // 初始化月网格
    function initializeMonthsGrid() {
        const monthsGrid = document.getElementById('months-grid');
        monthsGrid.innerHTML = '';
        
        const totalMonths = 12;
        const currentMonth = new Date().getMonth();
        
        document.querySelector('.months-remaining .vis-ratio').textContent = `(${totalMonths - currentMonth - 1}/${totalMonths})`;
        
        for (let i = 0; i < totalMonths; i++) {
            const cell = document.createElement('div');
            if (i < currentMonth) {
                cell.className = 'grid-cell cell-past';
            } else if (i === currentMonth) {
                cell.className = 'grid-cell cell-current';
            } else {
                cell.className = 'grid-cell cell-future';
            }
            monthsGrid.appendChild(cell);
        }
    }
    
    // 初始化进度条
    function initializeProgressBars() {
        // 生命进度（年）- 31%
        createProgressBar('life-progress-years', 31, '#2196F3');
        
        // 黄金年进度（月）- 56%
        createProgressBar('prime-years-progress', 56, '#FF9800');
        
        // 生命进度（月）- 32%
        createProgressBar('life-progress-months', 32, '#9C27B0');
    }
    
    // 创建进度条
    function createProgressBar(id, percentage, color) {
        const progressBar = document.getElementById(id);
        progressBar.innerHTML = '';
        
        // 创建进度条内的小方格
        const totalCells = 100;
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.style.width = '1%';
            cell.style.height = '100%';
            cell.style.display = 'inline-block';
            
            if (i < percentage) {
                cell.style.backgroundColor = color;
            } else {
                cell.style.backgroundColor = '#f5f5f5';
            }
            
            progressBar.appendChild(cell);
        }
    }
});

// 切换语言函数
function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.setAttribute('lang', lang);
    
    // 更新所有带有 data-i18n 属性的元素
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // 更新特殊元素（如日期格式等）
    updateSpecialElements(lang);
    
    // 保存用户语言偏好
    localStorage.setItem('preferredLanguage', lang);
}

// 更新特殊元素
function updateSpecialElements(lang) {
    // 更新日期和时间
    const now = new Date();
    
    // 格式化日期
    const formattedDate = lang === 'zh' 
        ? `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
        : new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(now);
    document.getElementById('current-date').textContent = formattedDate;
    
    // 更新今日剩余时间标题中的日期
    const todayDateElement = document.querySelector('.remaining-section:nth-child(2) .section-title');
    if (todayDateElement) {
        const todayText = translations[lang].whatsLeftForToday;
        todayDateElement.innerHTML = `<i class="far fa-clock icon-section"></i> <span>${todayText} (${formattedDate})</span>`;
    }
    
    // 更新时间
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    let formattedTime;
    if (lang === 'zh') {
        const ampm = hours < 12 ? '上午' : '下午';
        const displayHours = hours % 12 || 12;
        formattedTime = `${ampm}${displayHours}:${minutes}:${seconds}`;
    } else {
        const ampm = hours < 12 ? 'AM' : 'PM';
        const displayHours = hours % 12 || 12;
        formattedTime = `${displayHours}:${minutes}:${seconds} ${ampm}`;
    }
    document.getElementById('current-time').textContent = formattedTime;
    
    // 更新时间槽文本
    const slotNumber = Math.floor((hours * 60 + parseInt(minutes)) / 30) + 1;
    const slotsPassedElement = document.querySelector('.slots-passed');
    if (slotsPassedElement) {
        if (lang === 'zh') {
            slotsPassedElement.innerHTML = `今天已过 <span id="slots-passed">${slotNumber}</span> 个时段`;
        } else {
            slotsPassedElement.innerHTML = `<span id="slots-passed">${slotNumber}</span> slots passed today`;
        }
    }
    
    // 更新年份文本
    const yearElement = document.querySelector('.remaining-section:first-child .section-title');
    if (yearElement) {
        const yearText = translations[lang].whatsLeftForYear.replace('2025', now.getFullYear());
        yearElement.innerHTML = `<i class="far fa-calendar-alt icon-section"></i> <span>${yearText}</span>`;
    }
}
