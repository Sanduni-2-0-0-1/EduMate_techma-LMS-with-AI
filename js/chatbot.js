// AI Chatbot System
class AIChatbot {
    constructor() {
        this.isOpen = false;
        // CHANGE 1: Point to the local Node.js API Bridge
        this.apiUrl = '/api/chat'; 
        // CHANGE 2: Assume local connection is established
        this.isConnected = true; 
        this.init();
    }

    init() {
        console.log('Debug: Starting init...');
        this.createChatbotHTML();
        console.log('Debug: HTML added to body', document.getElementById('chatbotToggle'));
        this.setupEventListeners();
        console.log('Debug: Events set');
        this.addWelcomeMessage();
        console.log('Debug: Welcome added');
        // REMOVED: this.testConnection(); 
        console.log('🤖 AI Chatbot initialized');
    }

    createChatbotHTML() {
        const html = `
        <button class="chatbot-toggle" id="chatbotToggle">
            <i class="fas fa-robot"></i>  </button>
        <div class="chatbot-window" id="chatbotWindow">
            <div class="chatbot-header">
                <h3 id="chatbotHeader">AI Learning Assistant <span id="connectionStatus">●</span></h3>
                <button class="chatbot-close" id="chatbotClose">&times;</button>
            </div>
            <div class="chatbot-messages" id="chatbotMessages"></div>
            <div class="typing-indicator" id="typingIndicator">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
                AI is typing...
            </div>
            <div class="chatbot-input">
                <input type="text" id="chatbotInput" placeholder="Ask about lessons, summaries, IT queries...">
                <button id="chatbotSend"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    setupEventListeners() {
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const send = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');

        if (toggle) toggle.addEventListener('click', () => this.toggleChat());
        if (close) close.addEventListener('click', () => this.closeChat());
        if (send) send.addEventListener('click', () => this.sendMessage());
        if (input) input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });               
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbotWindow');
        if (window) window.style.display = this.isOpen ? 'flex' : 'none';
    }

    closeChat() {
        this.isOpen = false;
        const window = document.getElementById('chatbotWindow');
        if (window) window.style.display = 'none';
    }

    addMessage(text, sender) {
        const messages = document.getElementById('chatbotMessages');
        if (!messages) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <strong>${sender === 'user' ? 'You' : 'AI'}:</strong> ${text}
            </div>
        `;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    addWelcomeMessage() {
        this.addMessage("Hi! I'm your AI Study Assistant. I can summarize notes/PDFs/videos, generate questions, or answer IT queries. Try: 'Summarize lesson 1' or 'What is HTML?'", 'bot');
        // Set initial status to connected (to the local server)
        this.updateConnectionStatus(true); 
    }

    showTyping() {
        document.getElementById('typingIndicator').style.display = 'block';
    }

    hideTyping() {
        document.getElementById('typingIndicator').style.display = 'none';
    }

    // REMOVED: testConnection()
    // REMOVED: getMockResponse()

    updateConnectionStatus(connected) {
        const status = document.getElementById('connectionStatus');
        if (status) {
            status.style.color = connected ? '#10b981' : '#ef4444';
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';
        this.showTyping();

        try {
            // SIMPLIFIED: Always send to the local Express API bridge
            const response = await this.sendToAI(message);

            this.hideTyping();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideTyping();
            this.addMessage("Sorry, the server bridge encountered an issue. Please check the backend connection to the Hugging Face API.", 'bot');
            console.error('Chat error:', error);
        }
    }

    async sendToAI(message) {
        const context = this.getCourseContext();

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, context })
        });

        if (!response.ok) throw new Error('API unavailable or returned an error');
        const data = await response.json();
        return data.reply;
    }

    getCourseContext() {
        const courseTitle = document.querySelector('.course-hero-content h1, .page-hero-content h1')?.textContent || 'General';
        const currentVideo = document.querySelector('.video-card:hover .video-info h3')?.textContent || '';
        const lessonNotes = document.getElementById('lesson-dropdown')?.value || '';
        const pdfText = document.querySelector('[data-pdf-text]:hover')?.getAttribute('data-pdf-text') || '';

        return {
            course: courseTitle,
            currentTopic: currentVideo,
            notes: lessonNotes,
            pdfExcerpt: pdfText
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new AIChatbot();
    console.log('🚀 AI Chatbot ready!');
});