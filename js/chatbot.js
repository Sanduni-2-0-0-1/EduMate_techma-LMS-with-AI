// AI Chatbot System
class AIChatbot {
    constructor() {
        this.isOpen = false;
        // This will be updated with your Colab URL
        this.apiUrl = 'https://your-colab-url.ngrok.io/api/chat';
        this.isConnected = false;
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.setupEventListeners();
        this.addWelcomeMessage();
        this.testConnection();
        console.log('🤖 AI Chatbot initialized');
    }

    async testConnection() {
        try {
            const response = await fetch(this.apiUrl.replace('/chat', '/health'));
            if (response.ok) {
                this.isConnected = true;
                console.log('✅ AI Chatbot connected to backend');
                this.updateConnectionStatus(true);
            } else {
                this.isConnected = false;
                this.updateConnectionStatus(false);
            }
        } catch (error) {
            this.isConnected = false;
            this.updateConnectionStatus(false);
            console.log('❌ AI Chatbot using mock responses');
        }
    }

    updateConnectionStatus(connected) {
        const header = document.querySelector('.chatbot-header h3');
        if (header) {
            if (connected) {
                header.innerHTML = 'AI Learning Assistant <span style="color: #10b981;">●</span>';
            } else {
                header.innerHTML = 'AI Learning Assistant <span style="color: #ef4444;">●</span>';
            }
        }
    }

    // ... (rest of your existing chatbot code remains the same)

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // Show typing indicator
        this.showTyping();

        try {
            let response;
            if (this.isConnected) {
                // Use real AI backend
                response = await this.sendToAI(message);
            } else {
                // Use mock responses
                response = await this.getMockResponse(message);
            }
            
            this.hideTyping();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideTyping();
            this.addMessage("I'm having trouble connecting right now. Please try again later.", 'bot');
            console.error('Chatbot error:', error);
        }
    }

    async sendToAI(message) {
        const context = this.getCourseContext();
        
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                context: context
            })
        });

        if (!response.ok) {
            throw new Error('AI service unavailable');
        }

        const data = await response.json();
        return data.response;
    }

    getCourseContext() {
        // Get current course information for context
        const courseTitle = document.querySelector('.course-hero-content h1')?.textContent || 
                           document.querySelector('.page-hero-content h1')?.textContent || 
                           'General';
        
        const currentVideo = document.querySelector('.video-card:hover h3')?.textContent || '';
        const pageUrl = window.location.href;
        
        return {
            course: courseTitle,
            currentTopic: currentVideo,
            pageUrl: pageUrl,
            timestamp: new Date().toISOString()
        };
    }

    // Method to update API URL when Colab is ready
    setApiUrl(url) {
        this.apiUrl = url;
        this.isConnected = true;
        this.testConnection();
        console.log('🔗 Chatbot API URL updated to:', url);
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new AIChatbot();
    console.log('🚀 AI Chatbot ready!');
    
    // You can update the URL later when Colab is running
    // window.chatbot.setApiUrl('https://your-actual-colab-url.ngrok.io/api/chat');
});