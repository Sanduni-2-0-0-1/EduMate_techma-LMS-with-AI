// Account Management System
class AccountSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupForms();
        this.loadUserData();
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');

                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(tabId + 'Tab').classList.add('active');
            });
        });
    }

    setupForms() {
        const profileForm = document.getElementById('profileForm');
        const securityForm = document.getElementById('securityForm');
        const preferencesForm = document.getElementById('preferencesForm');

        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }

        if (securityForm) {
            securityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSecurity();
            });
        }

        if (preferencesForm) {
            preferencesForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePreferences();
            });
        }
    }

    loadUserData() {
        if (window.auth && window.auth.getCurrentUser()) {
            const user = window.auth.getCurrentUser();
            
            const firstNameInput = document.getElementById('accountFirstName');
            const lastNameInput = document.getElementById('accountLastName');
            const emailInput = document.getElementById('accountEmail');
            const displayUserName = document.getElementById('displayUserName');

            if (firstNameInput) firstNameInput.value = user.firstName || '';
            if (lastNameInput) lastNameInput.value = user.lastName || '';
            if (emailInput) emailInput.value = user.email || '';
            if (displayUserName) displayUserName.textContent = `${user.firstName} ${user.lastName}`;
        }
    }

    saveProfile() {
        const formData = {
            firstName: document.getElementById('accountFirstName').value,
            lastName: document.getElementById('accountLastName').value,
            email: document.getElementById('accountEmail').value,
            phone: document.getElementById('accountPhone').value,
            bio: document.getElementById('accountBio').value
        };

        // Simulate API call
        setTimeout(() => {
            if (window.auth && window.auth.getCurrentUser()) {
                const user = window.auth.getCurrentUser();
                user.firstName = formData.firstName;
                user.lastName = formData.lastName;
                user.email = formData.email;
                window.auth.saveUser(user);
            }
            alert('Profile updated successfully!');
        }, 1000);
    }

    saveSecurity() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword && newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        setTimeout(() => {
            alert('Security settings updated successfully!');
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmNewPassword').value = '';
        }, 1000);
    }

    savePreferences() {
        const preferences = {
            emailNotifications: document.getElementById('emailNotifications').checked,
            courseUpdates: document.getElementById('courseUpdates').checked,
            marketingEmails: document.getElementById('marketingEmails').checked,
            autoPlay: document.getElementById('autoPlay').checked,
            downloadable: document.getElementById('downloadable').checked
        };

        setTimeout(() => {
            localStorage.setItem('techma_preferences', JSON.stringify(preferences));
            alert('Preferences saved successfully!');
        }, 800);
    }
}

// Initialize account system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AccountSystem();
});