// load-components.js

document.addEventListener('DOMContentLoaded', function() {
    loadComponent('navbar-placeholder', 'navbar.html');
    loadComponent('footer-placeholder', 'footer.html');
});

function loadComponent(componentId, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(componentId).innerHTML = data;

            // Add logic to handle the Logout button visibility
            if (componentId === 'navbar-placeholder') {
                const jwtToken = localStorage.getItem('jwt');
                const userRole = localStorage.getItem('userRole');
                const logoutItem = document.getElementById('logout-item');
                const loginItem = document.getElementById('login-item');
                const isUser = document.getElementById('isUser');
                const isAdmin = document.getElementById('isAdmin');
                if (jwtToken) {
                    logoutItem.style.display = 'block';
                    loginItem.style.display = 'none';
                    if (userRole === "EMPLOYEE") {
                        isUser.style.display = 'block';
                        isAdmin.style.display = 'none';
                    } else if (userRole === "ADMIN") {
                        isUser.style.display = 'block';
                        isAdmin.style.display = 'block';
                    }
                } else {
                    logoutItem.style.display = 'none';
                    loginItem.style.display = 'block';
                    isUser.style.display = 'none';
                    isAdmin.style.display = 'none';
                }
            }
        });
}
