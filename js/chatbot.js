// AI Chatbot System (Updated for Gradio/Hugging Face Backend)
class AIChatbot {
    constructor() {
        this.isOpen = false;
        // CHANGE THIS: your Hugging Face Gradio share link
        this.apiUrl = "https://webdevbot2025-techma-lms-ai.hf.space";
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.setupEventListeners();
        this.addWelcomeMessage();
        console.log('🤖 AI Chatbot initialized');
    }

    createChatbotHTML() {
        const html = `
    <button class="chatbot-toggle" id="chatbotToggle">
        <i class="fas fa-robot"></i>
    </button>
    <div class="chatbot-window" id="chatbotWindow" style="display:none; flex-direction:column;">
        <button class="chatbot-close" id="chatbotClose">&times;</button>
        <iframe id="chatbotIframe" 
            src="https://webdevbot2025-techma-lms-ai.hf.space" 
            width="100%" height="600px" style="border:none; border-radius:12px;">
        </iframe>
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
        if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.sendMessage(); });
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
        messageDiv.innerHTML = `<div class="message-content"><strong>${sender === 'user' ? 'You' : 'AI'}:</strong> ${text}</div>`;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    addWelcomeMessage() {
        this.addMessage("Hi! I'm your AI Study Assistant. I can summarize lessons, PDFs, and videos, or answer IT queries.", 'bot');
        this.updateConnectionStatus(true);
    }

    showTyping() { document.getElementById('typingIndicator').style.display = 'block'; }
    hideTyping() { document.getElementById('typingIndicator').style.display = 'none'; }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';
        this.showTyping();

        try {
            const context = this.getCourseContext();
            const response = await this.sendToAI(message, context);
            this.hideTyping();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideTyping();
            this.addMessage("Sorry, the AI service is unavailable.", 'bot');
            console.error('Chat error:', error);
        }
    }

    async sendToAI(message, context) {
        const payload = {
            data: [message, context.pdfExcerpt || "", context.videoTranscript || ""]
        };
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('API returned an error');
        const data = await response.json();
        return data.data ? data.data[0] : "No response from AI";
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
            pdfExcerpt: pdfText,
            videoTranscript: currentVideo // or you can store transcript text elsewhere
        };
    }

    updateConnectionStatus(connected) {
        const status = document.getElementById('connectionStatus');
        if (status) status.style.color = connected ? '#10b981' : '#ef4444';
    }
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new AIChatbot();
    console.log('🚀 AI Chatbot ready!');
});
