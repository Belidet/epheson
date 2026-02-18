// ===== Ephi App - 55-Day New Testament Reading Tracker =====

// Bible data structure
const bibleData = {
    books: [
        { name: "Matthew", chapters: 28, testament: "NT" },
        { name: "Mark", chapters: 16, testament: "NT" },
        { name: "Luke", chapters: 24, testament: "NT" },
        { name: "John", chapters: 21, testament: "NT" },
        { name: "Acts", chapters: 28, testament: "NT" },
        { name: "Romans", chapters: 16, testament: "NT" },
        { name: "1 Corinthians", chapters: 16, testament: "NT" },
        { name: "2 Corinthians", chapters: 13, testament: "NT" },
        { name: "Galatians", chapters: 6, testament: "NT" },
        { name: "Ephesians", chapters: 6, testament: "NT" },
        { name: "Philippians", chapters: 4, testament: "NT" },
        { name: "Colossians", chapters: 4, testament: "NT" },
        { name: "1 Thessalonians", chapters: 5, testament: "NT" },
        { name: "2 Thessalonians", chapters: 3, testament: "NT" },
        { name: "1 Timothy", chapters: 6, testament: "NT" },
        { name: "2 Timothy", chapters: 4, testament: "NT" },
        { name: "Titus", chapters: 3, testament: "NT" },
        { name: "Philemon", chapters: 1, testament: "NT" },
        { name: "Hebrews", chapters: 13, testament: "NT" },
        { name: "James", chapters: 5, testament: "NT" },
        { name: "1 Peter", chapters: 5, testament: "NT" },
        { name: "2 Peter", chapters: 3, testament: "NT" },
        { name: "1 John", chapters: 5, testament: "NT" },
        { name: "2 John", chapters: 1, testament: "NT" },
        { name: "3 John", chapters: 1, testament: "NT" },
        { name: "Jude", chapters: 1, testament: "NT" },
        { name: "Revelation", chapters: 22, testament: "NT" }
    ]
};

// Generate 55-day reading plan
function generateReadingPlan() {
    const totalDays = 55;
    const plan = [];
    let currentBook = 0;
    let currentChapter = 1;
    
    // Create reading plan
    for (let day = 1; day <= totalDays; day++) {
        let reading = {
            day: day,
            passages: [],
            completed: false,
            isCurrent: false
        };
        
        // Distribute chapters - average ~4.5 chapters per day for NT
        // First 3 days cover Matthew 1-15 (5 chapters per day)
        let chaptersPerDay;
        if (day <= 3) {
            chaptersPerDay = 5; // First 3 days: 5 chapters each to cover Matthew 1-15
        } else {
            chaptersPerDay = 4 + Math.floor(Math.random() * 2); // 4-5 chapters per day for rest
        }
        
        // Adjust for longer/shorter books
        while (chaptersPerDay > 0 && currentBook < bibleData.books.length) {
            const book = bibleData.books[currentBook];
            const remainingInBook = book.chapters - currentChapter + 1;
            
            if (remainingInBook <= chaptersPerDay) {
                // Take the rest of this book
                reading.passages.push({
                    book: book.name,
                    startChapter: currentChapter,
                    endChapter: book.chapters
                });
                chaptersPerDay -= remainingInBook;
                currentBook++;
                currentChapter = 1;
            } else {
                // Take part of this book
                reading.passages.push({
                    book: book.name,
                    startChapter: currentChapter,
                    endChapter: currentChapter + chaptersPerDay - 1
                });
                currentChapter += chaptersPerDay;
                chaptersPerDay = 0;
            }
        }
        
        plan.push(reading);
    }
    
    return plan;
}

// Initialize reading plan
let readingPlan = generateReadingPlan();

// Set initial progress state (Matthew 1-15 completed in first 3 days)
function setInitialProgress() {
    // Mark first 3 days as completed (Matthew 1-15)
    for (let i = 0; i < 3; i++) {
        if (readingPlan[i]) {
            readingPlan[i].completed = true;
        }
    }
    
    // Set Day 4 as current
    if (readingPlan[3]) {
        readingPlan[3].isCurrent = true;
    }
}

// Set initial progress
setInitialProgress();

// Load saved progress from localStorage
function loadProgress() {
    const savedProgress = localStorage.getItem('ephi-progress');
    if (savedProgress) {
        const completedDays = JSON.parse(savedProgress);
        
        // Reset all completed flags
        readingPlan.forEach(day => day.completed = false);
        
        // Apply saved progress
        completedDays.forEach(dayNum => {
            const day = readingPlan.find(d => d.day === dayNum);
            if (day) {
                day.completed = true;
            }
        });
        
        // Ensure first 3 days are always completed (user progress + initial)
        for (let i = 0; i < 3; i++) {
            if (readingPlan[i]) {
                readingPlan[i].completed = true;
            }
        }
        
        // Update current day
        updateCurrentDay();
    }
    
    // Update UI after loading
    renderReadingList();
    updateProgressBar();
}

// Save progress to localStorage
function saveProgress() {
    const completedDays = readingPlan
        .filter(day => day.completed)
        .map(day => day.day);
    localStorage.setItem('ephi-progress', JSON.stringify(completedDays));
}

// Update current day based on progress
function updateCurrentDay() {
    // Reset current flag
    readingPlan.forEach(day => day.isCurrent = false);
    
    // Find first incomplete day after day 3
    for (let i = 3; i < readingPlan.length; i++) {
        if (!readingPlan[i].completed) {
            readingPlan[i].isCurrent = true;
            break;
        }
    }
}

// Toggle day completion
function toggleDay(dayNum) {
    // Don't allow toggling of first 3 days (they're permanently completed)
    if (dayNum <= 3) {
        alert("Days 1-3 (Matthew 1-15) are permanently marked as completed.");
        return;
    }
    
    const day = readingPlan.find(d => d.day === dayNum);
    if (day) {
        day.completed = !day.completed;
        
        // Update current day
        updateCurrentDay();
        
        // Save to localStorage
        saveProgress();
        
        // Update UI
        renderReadingList();
        updateProgressBar();
    }
}

// Update progress bar
function updateProgressBar() {
    const completedCount = readingPlan.filter(day => day.completed).length;
    const totalDays = readingPlan.length;
    const percentage = (completedCount / totalDays) * 100;
    
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('progress-fill').style.width = `${percentage}%`;
}

// Format passage text
function formatPassage(passages) {
    if (passages.length === 1) {
        const p = passages[0];
        if (p.startChapter === p.endChapter) {
            return `${p.book} ${p.startChapter}`;
        } else {
            return `${p.book} ${p.startChapter}-${p.endChapter}`;
        }
    } else {
        return passages.map(p => {
            if (p.startChapter === p.endChapter) {
                return `${p.book} ${p.startChapter}`;
            } else {
                return `${p.book} ${p.startChapter}-${p.endChapter}`;
            }
        }).join(', ');
    }
}

// Render reading list
function renderReadingList() {
    const container = document.getElementById('reading-list');
    container.innerHTML = '';
    
    readingPlan.forEach(day => {
        const passageText = formatPassage(day.passages);
        
        const dayCard = document.createElement('div');
        dayCard.className = `day-card ${day.completed ? 'completed' : ''} ${day.isCurrent ? 'current' : ''}`;
        
        // Disable checkbox for first 3 days
        const checkboxDisabled = day.day <= 3 ? 'disabled' : '';
        
        dayCard.innerHTML = `
            <div class="day-number">Day ${day.day}</div>
            <div class="day-content">
                <div class="day-passage">${passageText}</div>
                <div class="day-description">New Testament Reading</div>
            </div>
            <div class="cross-icon" title="${day.completed ? 'Completed' : 'Incomplete'}"></div>
            <label class="checkbox-container">
                <input type="checkbox" ${day.completed ? 'checked' : ''} data-day="${day.day}" ${checkboxDisabled}>
                <span class="checkmark"></span>
            </label>
        `;
        
        container.appendChild(dayCard);
    });
    
    // Add event listeners to checkboxes (except disabled ones)
    document.querySelectorAll('.checkbox-container input:not(:disabled)').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const dayNum = parseInt(e.target.dataset.day);
            toggleDay(dayNum);
        });
    });
}

// ===== Notification System with Custom Time =====

// Load notification preferences
function loadNotificationPreferences() {
    const savedTime = localStorage.getItem('ephi-notification-time');
    const notificationsEnabled = localStorage.getItem('ephi-notifications-enabled') === 'true';
    
    if (savedTime) {
        document.getElementById('reminder-time').value = savedTime;
    }
    
    updateNotificationUI(notificationsEnabled);
    return notificationsEnabled;
}

// Save notification preferences
function saveNotificationPreferences(time, enabled) {
    if (time) {
        localStorage.setItem('ephi-notification-time', time);
    }
    localStorage.setItem('ephi-notifications-enabled', enabled);
}

// Update notification UI based on state
function updateNotificationUI(enabled) {
    const enableBtn = document.getElementById('enable-notifications');
    const disableBtn = document.getElementById('disable-notifications');
    const statusEl = document.getElementById('notification-status');
    const timePicker = document.getElementById('reminder-time');
    
    if (enabled) {
        enableBtn.classList.add('hidden');
        disableBtn.classList.remove('hidden');
        timePicker.disabled = false;
        statusEl.textContent = `Notifications are enabled for ${timePicker.value}`;
        statusEl.style.color = 'var(--gold-light)';
    } else {
        enableBtn.classList.remove('hidden');
        disableBtn.classList.add('hidden');
        timePicker.disabled = false;
        statusEl.textContent = 'Notifications are disabled';
        statusEl.style.color = 'var(--gray-light)';
    }
}

// Schedule daily notification at specified time
async function scheduleNotification(timeString) {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        console.error('Notifications not supported');
        return false;
    }
    
    try {
        const registration = await navigator.serviceWorker.ready;
        
        // Parse the time
        const [hours, minutes] = timeString.split(':').map(Number);
        
        // Calculate next notification time
        const now = new Date();
        const notificationTime = new Date();
        notificationTime.setHours(hours, minutes, 0, 0);
        
        if (now > notificationTime) {
            notificationTime.setDate(notificationTime.getDate() + 1);
        }
        
        const timeUntilNotification = notificationTime - now;
        
        // Clear any existing notifications
        await registration.active.postMessage({
            type: 'CLEAR_NOTIFICATIONS'
        });
        
        // Schedule new notification
        setTimeout(() => {
            registration.showNotification('Ephi - Daily Reading Reminder', {
                body: `Time for today's New Testament reading! Day ${getCurrentDay()} awaits.`,
                icon: 'icons/icon-192x192.png',
                badge: 'icons/icon-72x72.png',
                vibrate: [200, 100, 200],
                tag:
