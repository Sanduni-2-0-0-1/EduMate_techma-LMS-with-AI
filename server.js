const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// API Routes
app.get('/api/courses', (req, res) => {
    const courses = [
        {
            id: 1,
            title: 'Web Design Mastery',
            description: 'Learn HTML, CSS, JavaScript and responsive design',
            image: 'Sources/webdesign.png',
            link: 'course-web-design.html',
            category: 'web-design'
        },
        {
            id: 2,
            title: 'Digital Marketing',
            description: 'Master SEO, social media, and online marketing strategies',
            image: 'Sources/digitalmar.png',
            link: 'course-digital-marketing.html',
            category: 'marketing'
        },
        {
            id: 3,
            title: 'Programming Basics',
            description: 'Learn Python programming and problem-solving skills',
            image: 'Sources/data.png',
            link: 'course-programming.html',
            category: 'programming'
        }
    ];
    res.json(courses);
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // In production, you would save to database or send email
    console.log('Contact form received:', { name, email, subject, message });
    
    res.json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
    });
});

// Serve all HTML pages
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    
    // Check if the file exists
    res.sendFile(filePath, (err) => {
        if (err) {
            // If file doesn't exist, serve index.html (for SPA routing)
            res.sendFile(path.join(__dirname, 'index.html'));
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TECHMA LMS running on port ${PORT}`);
});

module.exports = app;