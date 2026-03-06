function checkAuth() {
    const token = sessionStorage.getItem('token');
    const currentPage = window.location.pathname;
    
    if (!token && !currentPage.includes('login.html')) {
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

function getUser() {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Auto-check on page load
if (!window.location.pathname.includes('login.html')) {
    checkAuth();
}
