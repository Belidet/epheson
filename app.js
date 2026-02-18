// ===== Ephi App - 55-Day New Testament Reading Tracker =====

// Bible data structure with English book names
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
    
    for (let day = 1; day <= totalDays; day++) {
        let reading = {
            day: day,
            passages: [],
            completed: false,
            isCurrent: false
        };
        
        let chaptersPerDay;
        if (day <= 3) {
            chaptersPerDay = 5; // First 3 days: 5 chapters each for Matthew 1-15
        } else {
            chaptersPerDay = 4 + Math.floor(Math.random() * 2); // 4-5 chapters per day
        }
        
        while (chaptersPerDay > 0 && currentBook < bibleData.books.length) {
            const book = bibleData.books[currentBook];
            const remainingInBook = book.chapters - currentChapter + 1;
            
            if (remainingInBook <= chaptersPerDay) {
                reading.passages.push({
                    book: book.name,
                    startChapter: currentChapter,
                    endChapter: book.chapters
                });
                chaptersPerDay -= remainingInBook;
                currentBook++;
                currentChapter = 1;
            } else {
                reading.passages.push({
                    book: book.name,
                    startChapter: currentChapter,
                    endChapter: currentChapter + chaptersPerDay - 1
               
