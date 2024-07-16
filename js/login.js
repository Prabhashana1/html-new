document.addEventListener('DOMContentLoaded', function () {
    const showPasswordCheckbox = document.getElementById('show-password');
    const passwordInput = document.getElementById('password');
    showPasswordCheckbox.addEventListener('change', function () {
        if (this.checked) {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');

        //http://localhost:8080/api/auth/login
        fetch('https://megaback-production.up.railway.app/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    localStorage.setItem('jwt', data.data.jwt);
                    localStorage.setItem('userRole', data.data.userRole);
                    messageDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
                    if (data.data.userRole === 'ADMIN') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'user-dashboard.html';
                    }
                } else {
                    messageDiv.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                messageDiv.innerHTML = `<div class="alert alert-danger">An error occurred. Please try again later.${error}</div>`;
            });
    });
});