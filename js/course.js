// Course Media Management System
class CourseMedia {
    constructor() {
        this.videoModal = document.getElementById('videoModal');
        this.videoFrame = document.getElementById('videoFrame');
        this.init();
    }
    
    init() {
        this.setupVideoPlayers();
        this.setupDownloadButtons();
        this.setupProgressTracking();
        this.setupModal();
        console.log('Course media system initialized');
    }
    
    setupVideoPlayers() {
        const videoCards = document.querySelectorAll('.video-card');
        
        videoCards.forEach(card => {
            card.addEventListener('click', () => {
                const videoSrc = card.getAttribute('data-video-src');
                const videoType = card.getAttribute('data-video-type');
                
                this.playVideo(videoSrc, videoType);
            });
        });
        
        // Hero video preview
        const heroPreview = document.querySelector('.video-preview');
        if (heroPreview) {
            heroPreview.addEventListener('click', () => {
                this.playVideo('videos/course-intro.mp4', 'uploaded');
            });
        }
    }
    
    playVideo(src, type) {
        if (type === 'youtube') {
            // For YouTube videos
            this.videoFrame.src = src + '?autoplay=1';
        } else {
            // For uploaded videos
            this.videoFrame.src = src + '?autoplay=1';
        }
        
        this.openModal();
        this.trackVideoWatched(src);
    }
    
    setupModal() {
        const closeBtn = document.querySelector('.close-modal');
        
        // Close modal when clicking X
        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Close modal when clicking outside
        this.videoModal.addEventListener('click', (e) => {
            if (e.target === this.videoModal) {
                this.closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.videoModal.style.display === 'block') {
                this.closeModal();
            }
        });
    }
    
    openModal() {
        this.videoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.videoFrame.src = '';
    }
    
    setupDownloadButtons() {
        const downloadButtons = document.querySelectorAll('.download-btn');
        
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const fileUrl = button.getAttribute('data-file');
                this.downloadFile(fileUrl, button);
            });
        });
        
        // Quick download links
        const quickDownloads = document.querySelectorAll('.download-link');
        quickDownloads.forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackResourceDownloaded(link.href);
            });
        });
    }
    
    downloadFile(fileUrl, button) {
        // Simulate download process
        const originalHTML = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;
        
        setTimeout(() => {
            // Create temporary link for download
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileUrl.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Track download
            this.trackResourceDownloaded(fileUrl);
            
            // Restore button
            button.innerHTML = originalHTML;
            button.disabled = false;
            
            // Show success message
            this.showDownloadSuccess();
            
        }, 1500);
    }
    
    setupProgressTracking() {
        this.loadProgress();
        this.updateProgressDisplay();
    }
    
    loadProgress() {
        const progress = JSON.parse(localStorage.getItem('course_progress') || '{}');
        this.progress = progress;
    }
    
    saveProgress() {
        localStorage.setItem('course_progress', JSON.stringify(this.progress));
    }
    
    trackVideoWatched(videoSrc) {
        if (!this.progress.watchedVideos) {
            this.progress.watchedVideos = [];
        }
        
        if (!this.progress.watchedVideos.includes(videoSrc)) {
            this.progress.watchedVideos.push(videoSrc);
            this.saveProgress();
            this.updateProgressDisplay();
        }
    }
    
    trackResourceDownloaded(fileUrl) {
        if (!this.progress.downloadedResources) {
            this.progress.downloadedResources = [];
        }
        
        if (!this.progress.downloadedResources.includes(fileUrl)) {
            this.progress.downloadedResources.push(fileUrl);
            this.saveProgress();
            this.updateProgressDisplay();
        }
    }
    
    updateProgressDisplay() {
        const totalVideos = document.querySelectorAll('.video-card').length;
        const totalResources = document.querySelectorAll('.resource-card').length + 3; // +3 for quick downloads
        
        const watchedVideos = (this.progress.watchedVideos || []).length;
        const downloadedResources = (this.progress.downloadedResources || []).length;
        
        const videoProgress = (watchedVideos / totalVideos) * 100;
        const resourceProgress = (downloadedResources / totalResources) * 100;
        const totalProgress = (videoProgress + resourceProgress) / 2;
        
        // Update progress circle
        const circle = document.querySelector('.circle');
        if (circle) {
            circle.style.background = `conic-gradient(#10b981 ${totalProgress}%, #e2e8f0 ${totalProgress}%)`;
            document.querySelector('.progress-value').textContent = Math.round(totalProgress) + '%';
        }
        
        // Update stats
        const videoStat = document.querySelector('.stat:first-child .number');
        const resourceStat = document.querySelector('.stat:last-child .number');
        
        if (videoStat) videoStat.textContent = `${watchedVideos}/${totalVideos}`;
        if (resourceStat) resourceStat.textContent = `${downloadedResources}/${totalResources}`;
    }
    
    showDownloadSuccess() {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'download-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>File downloaded successfully!</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        // Add CSS for animation
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CourseMedia();
    });
} else {
    new CourseMedia();
}