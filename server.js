const express = require('express');
const path = require('path');
const cors = require('cors');
// NEW: Import axios for making HTTP requests to the external AI service
const axios = require('axios'); 

const app = express();
const PORT = process.env.PORT || 3000;

// !!! CRITICAL: REPLACE THIS URL with the public URL you got from running the Python script in Colab !!!
// This is the bridge endpoint that Node.js will talk to.
const PYTHON_AI_API_URL = 'https://huggingface.co/spaces/WebDevBot2025/techma-lms-ai'; 


// Global courses object 
const courses = {
    1: {
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
    2: {
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
    3: {
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
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// API Routes
app.get('/api/courses', (req, res) => {
    const courseList = Object.values(courses);
    res.json({ success: true, data: courseList });
});

app.get('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses[courseId];
    if (course) {
        res.json({ success: true, data: course });
    } else {
        res.status(404).json({ success: false, message: 'Course not found' });
    }
});

// === UPDATED AI CHATBOT API ROUTE (BRIDGE) ===
// AI CHATBOT API ROUTE (Node.js bridge)
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ success: false, reply: 'No message provided.' });
    }

    try {
        // Gradio expects a JSON with {"data": ["user message"]}
        const aiResponse = await axios.post(PYTHON_AI_API_URL, {
            data: [userMessage]
        });

        // Gradio returns a list in aiResponse.data.data
        const reply = aiResponse.data?.data?.[0] || "Sorry, no response from AI.";

        res.json({ success: true, reply });

    } catch (error) {
        console.error('Error connecting to Gradio AI:', error.message);
        res.status(503).json({ 
            success: false,
            reply: 'AI server is offline or unreachable. Check your Gradio link.'
        });
    }
});


// ===================================


// Contact form endpoint (rest of file remains unchanged)
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

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
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
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