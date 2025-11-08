// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUser();
        this.updateUI();
        this.attachEventListeners();
    }

    loadUser() {
        const userData = localStorage.getItem('techma_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    saveUser(user) {
        this.currentUser = user;
        localStorage.setItem('techma_user', JSON.stringify(user));
        this.updateUI();
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const user = {
                        id: 1,
                        firstName: 'John',
                        lastName: 'Doe',
                        email: email,
                        avatar: 'Sources/user-avatar.jpg'
                    };
                    this.saveUser(user);
                    resolve(user);
                } else {
                    reject('Invalid email or password');
                }
            }, 1000);
        });
    }

    register(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (userData.email && userData.password) {
                    const user = {
                        id: Date.now(),
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        avatar: 'Sources/user-avatar.jpg'
                    };
                    this.saveUser(user);
                    resolve(user);
                } else {
                    reject('Please fill all required fields');
                }
            }, 1000);
        });
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('techma_user');
        this.updateUI();
        window.location.href = 'index.html';
    }

    updateUI() {
        const authBtns = document.getElementById('authBtns');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            if (authBtns) authBtns.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userName) userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        } else {
            if (authBtns) authBtns.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    attachEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // User dropdown
        const userBtn = document.getElementById('userBtn');
        const userDropdown = document.getElementById('userDropdown');
        if (userBtn && userDropdown) {
            userBtn.addEventListener('click', () => {
                userDropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }

        this.setupPasswordToggles();
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const loginText = document.getElementById('loginText');
        const loginSpinner = document.getElementById('loginSpinner');

        if (loginText && loginSpinner) {
            loginText.style.display = 'none';
            loginSpinner.style.display = 'block';
        }

        try {
            await this.login(email, password);
            window.location.href = 'account.html';
        } catch (error) {
            alert(error);
        } finally {
            if (loginText && loginSpinner) {
                loginText.style.display = 'block';
                loginSpinner.style.display = 'none';
            }
        }
    }

    async handleRegister() {
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value
        };

        const registerText = document.getElementById('registerText');
        const registerSpinner = document.getElementById('registerSpinner');

        if (registerText && registerSpinner) {
            registerText.style.display = 'none';
            registerSpinner.style.display = 'block';
        }

        try {
            await this.register(formData);
            window.location.href = 'account.html';
        } catch (error) {
            alert(error);
        } finally {
            if (registerText && registerSpinner) {
                registerText.style.display = 'block';
                registerSpinner.style.display = 'none';
            }
        }
    }

    setupPasswordToggles() {
        const toggles = document.querySelectorAll('.toggle-password');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.parentElement.querySelector('input');
                const icon = toggle.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
}

// Initialize authentication system
const auth = new AuthSystem();

// Password strength indicator
const passwordInput = document.getElementById('registerPassword');
if (passwordInput) {
    passwordInput.addEventListener('input', function() {
        const strengthBar = this.parentElement.querySelector('.strength-bar');
        const strengthText = this.parentElement.querySelector('.strength-text');
        
        if (this.value.length === 0) {
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Password strength';
        } else if (this.value.length < 6) {
            strengthBar.style.width = '25%';
            strengthBar.style.background = '#ef4444';
            strengthText.textContent = 'Weak';
        } else if (this.value.length < 8) {
            strengthBar.style.width = '50%';
            strengthBar.style.background = '#f59e0b';
            strengthText.textContent = 'Fair';
        } else if (this.value.length < 10) {
            strengthBar.style.width = '75%';
            strengthBar.style.background = '#10b981';
            strengthText.textContent = 'Good';
        } else {
            strengthBar.style.width = '100%';
            strengthBar.style.background = '#10b981';
            strengthText.textContent = 'Strong';
        }
    });
}

// Add this to your auth.js file
function setupSocialLogins() {
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            simulateGoogleLogin();
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            simulateFacebookLogin();
        });
    }
}

function simulateGoogleLogin() {
    // Show loading state
    const originalText = document.querySelector('.google-btn').innerHTML;
    document.querySelector('.google-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    
    setTimeout(() => {
        // Create a mock Google user
        const googleUser = {
            id: 'google_' + Date.now(),
            firstName: 'Google',
            lastName: 'User',
            email: 'google.user@example.com',
            avatar: 'Sources/user-avatar.jpg',
            provider: 'google'
        };
        
        // Save to auth system
        if (window.auth) {
            window.auth.saveUser(googleUser);
            alert('Successfully logged in with Google!');
            window.location.href = 'account.html';
        }
        
        // Restore button text
        document.querySelector('.google-btn').innerHTML = originalText;
    }, 2000);
}

function simulateFacebookLogin() {
    // Show loading state
    const originalText = document.querySelector('.facebook-btn').innerHTML;
    document.querySelector('.facebook-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    
    setTimeout(() => {
        // Create a mock Facebook user
        const facebookUser = {
            id: 'facebook_' + Date.now(),
            firstName: 'Facebook',
            lastName: 'User',
            email: 'facebook.user@example.com',
            avatar: 'Sources/user-avatar.jpg',
            provider: 'facebook'
        };
        
        // Save to auth system
        if (window.auth) {
            window.auth.saveUser(facebookUser);
            alert('Successfully logged in with Facebook!');
            window.location.href = 'account.html';
        }
        
        // Restore button text
        document.querySelector('.facebook-btn').innerHTML = originalText;
    }, 2000);
}

// Call this function in your AuthSystem constructor
// Add this line in AuthSystem init() method:
// this.setupSocialLogins();