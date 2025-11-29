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
            category: 'web-design',
            duration: '6 weeks',
            lessons: 15,
            level: 'Beginner'
        },
        {
            id: 2,
            title: 'Digital Marketing',
            description: 'Master SEO, social media, and online marketing strategies',
            image: 'Sources/digitalmar.png',
            link: 'course-digital-marketing.html',
            category: 'marketing',
            duration: '8 weeks',
            lessons: 18,
            level: 'Beginner'
        },
        {
            id: 3,
            title: 'Programming Basics',
            description: 'Learn Python programming and problem-solving skills',
            image: 'Sources/data.png',
            link: 'course-programming.html',
            category: 'programming',
            duration: '10 weeks',
            lessons: 20,
            level: 'Beginner'
        }
    ];
    res.json({ success: true, data: courses });
});

// Get specific course details
app.get('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const courses = {
        1: {
            id: 1,
            title: 'Web Design Mastery',
            description: 'Complete web design course with hands-on projects',
            instructor: 'Sarah Johnson',
            duration: '6 weeks',
            level: 'Beginner',
            videos: [
                { id: 1, title: 'HTML Basics', duration: '15:30', url: 'videos/html-intro.mp4' },
                { id: 2, title: 'CSS Fundamentals', duration: '22:15', url: 'videos/css-basics.mp4' },
                { id: 3, title: 'JavaScript Introduction', duration: '18:45', url: 'videos/js-intro.mp4' },
                { id: 4, title: 'Responsive Design', duration: '25:20', url: 'videos/responsive-design.mp4' }
            ],
            resources: [
                { id: 1, title: 'HTML Cheatsheet', type: 'pdf', size: '2.1MB', url: 'resources/html-cheatsheet.pdf' },
                { id: 2, title: 'CSS Guide', type: 'pdf', size: '3.5MB', url: 'resources/css-guide.pdf' },
                { id: 3, title: 'Starter Templates', type: 'zip', size: '5.2MB', url: 'resources/starter-templates.zip' }
            ]
        },
        2: {
            id: 2,
            title: 'Digital Marketing',
            description: 'Master digital marketing strategies and tools',
            instructor: 'Mike Chen',
            duration: '8 weeks',
            level: 'Beginner',
            videos: [
                { id: 1, title: 'SEO Fundamentals', duration: '25:30', url: 'videos/seo-basics.mp4' },
                { id: 2, title: 'Social Media Strategy', duration: '32:15', url: 'videos/social-media.mp4' },
                { id: 3, title: 'Google Ads', duration: '28:45', url: 'videos/google-ads.mp4' },
                { id: 4, title: 'Marketing Analytics', duration: '35:20', url: 'videos/analytics.mp4' }
            ],
            resources: [
                { id: 1, title: 'SEO Optimization Guide', type: 'pdf', size: '3.2MB', url: 'resources/seo-guide.pdf' },
                { id: 2, title: 'Social Media Templates', type: 'zip', size: '4.5MB', url: 'resources/social-media-templates.zip' },
                { id: 3, title: 'Marketing Plan Template', type: 'pdf', size: '2.8MB', url: 'resources/marketing-plan-template.pdf' }
            ]
        },
        3: {
            id: 3,
            title: 'Programming Basics',
            description: 'Learn programming fundamentals with Python',
            instructor: 'Emma Rodriguez',
            duration: '10 weeks',
            level: 'Beginner',
            videos: [
                { id: 1, title: 'Python Fundamentals', duration: '45:30', url: 'videos/python-basics.mp4' },
                { id: 2, title: 'Control Structures', duration: '38:15', url: 'videos/control-structures.mp4' },
                { id: 3, title: 'Functions & Modules', duration: '42:45', url: 'videos/functions.mp4' },
                { id: 4, title: 'Data Structures', duration: '55:20', url: 'videos/data-structures.mp4' }
            ],
            resources: [
                { id: 1, title: 'Python Syntax Cheatsheet', type: 'pdf', size: '2.5MB', url: 'resources/python-cheatsheet.pdf' },
                { id: 2, title: 'Coding Exercises', type: 'zip', size: '6.2MB', url: 'resources/coding-exercises.zip' },
                { id: 3, title: 'Project Templates', type: 'zip', size: '8.7MB', url: 'resources/project-templates.zip' }
            ]
        }
    };

    const course = courses[courseId];
    if (course) {
        res.json({ success: true, data: course });
    } else {
        res.status(404).json({ success: false, message: 'Course not found' });
    }
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required' 
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please enter a valid email address' 
        });
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Log the submission
    
    console.log('Contact form submission:', { name, email, subject, message });
    
    res.json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
        data: { name, email, subject, message }
    });
});

// Newsletter subscription
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email is required' 
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please enter a valid email address' 
        });
    }

    console.log('Newsletter subscription:', email);
    
    res.json({
        success: true,
        message: 'Thank you for subscribing to our newsletter!'
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'TECHMA LMS API is running smoothly',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Serve specific HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'terms.html'));
});

app.get('/course-web-design', (req, res) => {
    res.sendFile(path.join(__dirname, 'course-web-design.html'));
});

app.get('/course-digital-marketing', (req, res) => {
    res.sendFile(path.join(__dirname, 'course-digital-marketing.html'));
});

app.get('/course-programming', (req, res) => {
    res.sendFile(path.join(__dirname, 'course-programming.html'));
});

// Serve all other static files (CSS, JS, images)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/Sources', express.static(path.join(__dirname, 'Sources')));

// Catch-all handler - serve index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'API endpoint not found' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TECHMA LMS Server running on http://localhost:${PORT}`);
    console.log(`📚 Serving ${Object.keys(courses).length} courses`);
    console.log(`🌐 API available at http://localhost:${PORT}/api`);
    console.log(`📧 Contact form: http://localhost:${PORT}/contact`);
});

module.exports = app;