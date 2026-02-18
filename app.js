// ===== Ephi App - 52-Day New Testament Reading Tracker =====

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

// Generate 52-day reading plan
function generateReadingPlan() {
    const totalDays = 52;
    const plan = [];
    let currentBook = 0;
    let currentChapter = 1;
    
    // User has read Matthew 1-15
    const completedThroughMatthew15 = true;
    
    for (let day = 1; day <= totalDays; day++) {
        let reading = {
            day: day,
            passages: [],
            completed: false,
            isCurrent: false
        };
        
        // Distribute chapters evenly (average ~5 chapters per day for NT)
        let chaptersPerDay = 4 + Math.floor(Math.random() * 3); // 4-6 chapters per day
        
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

// Calculate which days are covered by Matthew 1-15
function getCompletedDaysFromMatthew1to15() {
    const completedDays = [];
    let chaptersRead = 0;
    
    for (let day = 0; day < readingPlan.length; day++) {
        const dayData = readingPlan[day];
        for (const passage of dayData.passages) {
            if (passage.book === "Matthew") {
                if (passage.endChapter <= 15) {
                    // This entire passage is within Matthew 1-15
                    if (!completedDays.includes(day)) {
                        completedDays.push(day);
                    }
                } else if (passage.startChapter <= 15 && passage.endChapter > 15) {
                    // This passage spans across Matthew 15, partial completion
                    // For simplicity, we'll mark this day as incomplete since it goes beyond 15
                    // You may want to adjust this logic based on your preference
                    break;
                }
            }
        }
    }
    
    return completedDays;
}

// Set initial progress state (Matthew 1-15 completed)
function setInitialProgress() {
    const completedDayIndices = getCompletedDaysFromMatthew1to15();
    
    completedDayIndices.forEach(dayIndex => {
        if (readingPlan[dayIndex]) {
            readingPlan[dayIndex].completed = true;
        }
    });
    
    // Find first incomplete day and mark as current
    for (let i = 0; i < readingPlan.length; i++) {
        if (!readingPlan[i].completed) {
            readingPlan[i].isCurrent = true;
            break;
        }
    }
}

// Set initial progress
setInitialProgress();

// Load saved progress from localStorage
function loadProgress() {
    const savedProgress = localStorage.getItem('ephi-progress');
    if (savedProgress) {
        const completedDays = JSON.parse(savedProgress);
        completedDays.forEach(dayNum => {
            const day = readingPlan.find(d => d.day === dayNum);
            if (day) {
                day.completed = true;
            }
        });
        
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
    
    // Find first incomplete day
    for (let i = 0; i < readingPlan.length; i++) {
        if (!readingPlan[i].completed) {
            readingPlan[i].isCurrent = true;
            break;
        }
    }
}

// Toggle day completion
function toggleDay(dayNum) {
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
        
        dayCard.innerHTML = `
            <div class="day-number">Day ${day.day}</div>
            <div class="day-content">
                <div class="day-passage">${passageText}</div>
                <div class="day-description">New Testament Reading</div>
            </div>
            <div class="saint-icon" title="St. ${day.completed ? 'Completed' : 'Incomplete'}"></div>
            <label class="checkbox-container">
                <input type="checkbox" ${day.completed ? 'checked' : ''} data-day="${day.day}">
                <span class="checkmark"></span>
            </label>
        `;
        
        container.appendChild(dayCard);
    });
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.checkbox-container input').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const dayNum = parseInt(e.target.dataset.day);
            toggleDay(dayNum);
        });
    });
}

// Notification handling
async function setupNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        const banner = document.getElementById('notification-banner');
        
        if (Notification.permission === 'granted') {
            banner.classList.add('hidden');
            scheduleDailyNotification();
        } else if (Notification.permission !== 'denied') {
            banner.classList.remove('hidden');
            
            document.getElementById('enable-notifications').addEventListener('click', async () => {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    banner.classList.add('hidden');
                    scheduleDailyNotification();
                }
            });
        }
    }
}

// Schedule daily notification (simplified version)
function scheduleDailyNotification() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        // Register service worker
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered');
                
                // Check current time and schedule next notification
                const now = new Date();
                const notificationTime = new Date();
                notificationTime.setHours(8, 0, 0, 0); // 8:00 AM
                
                if (now > notificationTime) {
                    notificationTime.setDate(notificationTime.getDate() + 1);
                }
                
                const timeUntilNotification = notificationTime - now;
                
                setTimeout(() => {
                    registration.showNotification('Ephi - Daily Reading Reminder', {
                        body: 'Time for today\'s New Testament reading!',
                        icon: 'icons/icon-192x192.png',
                        badge: 'icons/icon-72x72.png',
                        vibrate: [200, 100, 200],
                        tag: 'daily-reading',
                        renotify: true
                    });
                    
                    // Schedule next day's notification
                    setInterval(() => {
                        registration.showNotification('Ephi - Daily Reading Reminder', {
                            body: 'Time for today\'s New Testament reading!',
                            icon: 'icons/icon-192x192.png',
                            badge: 'icons/icon-72x72.png',
                            vibrate: [200, 100, 200],
                            tag: 'daily-reading',
                            renotify: true
                        });
                    }, 24 * 60 * 60 * 1000); // 24 hours
                }, timeUntilNotification);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Load progress from localStorage
    loadProgress();
    
    // Render initial reading list
    renderReadingList();
    
    // Update progress bar
    updateProgressBar();
    
    // Setup notifications
    setupNotifications();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .then(registration => {
                    console.log('PWA Service Worker registered:', registration);
                })
                .catch(error => {
                    console.error('PWA Service Worker registration failed:', error);
                });
        });
    }
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { readingPlan, bibleData };
}