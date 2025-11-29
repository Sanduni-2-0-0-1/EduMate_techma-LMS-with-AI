const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.get('/.netlify/functions/api/courses', (req, res) => {
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

module.exports.handler = serverless(app);