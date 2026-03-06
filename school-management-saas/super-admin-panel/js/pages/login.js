document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');
    const loginBtn = document.getElementById('loginBtn');

    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';
        errorDiv.classList.add('hidden');

        const response = await api.post('/auth/login', { email, password });
        
        if (response.data.role !== 'SuperAdmin') {
            throw new Error('Access denied. Super Admin only.');
        }

        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data));
        window.location.href = 'dashboard.html';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
    }
});
