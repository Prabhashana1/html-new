document.addEventListener('DOMContentLoaded', function () {


    const showPasswordCheckbox = document.getElementById('show-password');
    const userPassword= document.getElementById('resetPassword');
    const UserConfirmPassword= document.getElementById('resetConfirmPassword');

    showPasswordCheckbox.addEventListener('change', function () {
            if (this.checked) {
                userPassword.type = 'text';
                UserConfirmPassword.type = 'text';
            } else {

                userPassword.type = 'password';
                UserConfirmPassword.type = 'password';
            }
        });


    const jwtToken = localStorage.getItem('jwt'); // Get JWT token from local storage
    const userTableBody = document.getElementById('user-table-body');
    console.log(jwtToken);
    // Fetch users from the API
    fetch('https://megaback-production.up.railway.app/api/admin/get-user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
        .then(response => {
            if (response.status === 403 || response.status === 401) {
                window.location.href = 'unauthorized.html';
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data.code === 200) {
                data.data.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.password}</td>
                    <td>${user.phoneNumber}</td>
                    <td>${user.idNumber}</td>
                    <td>${user.userRole}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editUser(${user.id})">Edit</button>
                        <button class="btn btn-warning btn-sm" onclick="resetPassword(${user.id})">Reset Password</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;
                    userTableBody.appendChild(row);
                });
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));

    // Create new user
    document.getElementById('create-user-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const newUser = {
            name: document.getElementById('newUserName').value,
            email: document.getElementById('newUserEmail').value,
            phoneNumber: document.getElementById('newUserPhone').value,
            idNumber: document.getElementById('newUserIdNumber').value,
            userRole: document.getElementById('newUserRole').value,
            password: document.getElementById('newUserPassword').value,
            confirmPassword: document.getElementById('newUserConfirmPassword').value,
        };

        if (newUser.password !== newUser.confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return; // Exit if passwords do not match
        }

        let apiUrl;
        if (newUser.userRole === "ADMIN") {
            apiUrl = 'https://megaback-production.up.railway.app/api/admin/create-admin-account';
        } else if (newUser.userRole === "EMPLOYEE") {
            apiUrl = 'https://megaback-production.up.railway.app/api/admin/create-user-account';
        } else {
            alert('Invalid user role selected.');
            return; // Exit if user role is invalid
        }

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                phoneNumber: newUser.phoneNumber,
                idNumber: newUser.idNumber
            })
        })
            .then(response => {
                if (response.status === 403 || response.status === 401) {
                    window.location.href = 'unauthorized.html';
                } else {
                    return response.json();
                }
            })
            .then(data => {
                alert(data.message);
                $('#createUserModal').modal('hide'); // Hide the modal
                location.reload(); // Reload the page to refresh the user table
            })
            .catch(error => console.error('Error:', error));
    });



    document.getElementById('reset-password-form').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const userId = document.getElementById('resetUserId').value;
        const password= document.getElementById('resetPassword').value;
        const confirmPassword= document.getElementById('resetConfirmPassword').value;

        

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return; // Exit if passwords do not match
        }

        const resetPassword = {
            id: userId,
            password: password
        }

        fetch(`https://megaback-production.up.railway.app/api/admin/reset-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(resetPassword)
        })

            .then(response => {
                if (response.status === 403 || response.status === 401) {
                    window.location.href = 'unauthorized.html';
                } else {
                    return response.json();
                }
            })
            .then(data => {
                alert(data.message);
                $('#resetPasswordModel').modal('hide'); // Hide the modal
                location.reload(); // Reload the page to refresh the user table
            })
            .catch(error => console.error('Error:', error));
    });







    document.getElementById('update-user-form').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const updatedUser = {
            id: document.getElementById('userId').value,
            name: document.getElementById('editName').value,
            email: document.getElementById('editEmail').value,
            phoneNumber: document.getElementById('editPhoneNo').value,
            idNumber: document.getElementById('editIdNumber').value
        };
        

        fetch(`https://megaback-production.up.railway.app/api/admin/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(updatedUser)
        })

            .then(response => {
                if (response.status === 403 || response.status === 401) {
                    window.location.href = 'unauthorized.html';
                } else {
                    return response.json();
                }
            })
            .then(data => {
                alert(data.message);
                $('#editUserdModel').modal('hide'); // Hide the modal
                location.reload(); // Reload the page to refresh the user table
            })
            .catch(error => console.error('Error:', error));
    });







});



function resetPassword(userId) {
    const jwtToken = localStorage.getItem('jwt');
    fetch(`https://megaback-production.up.railway.app/api/admin/get-user-by-id/${userId}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
        .then(response => response.json())
        .then(user => {
            document.getElementById('resetUserId').value = user.data.id;
            document.getElementById('resetUserEmail').value = user.data.email;
            $('#resetPasswordModel').modal('show');
        })
        .catch(error => console.error('Error fetching user:', error));
}





function editUser(userId) {
    const jwtToken = localStorage.getItem('jwt');
    fetch(`https://megaback-production.up.railway.app/api/admin/get-user-by-id/${userId}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
        .then(response => response.json())
        .then(user => {
            document.getElementById('userId').value = user.data.id;
            document.getElementById('editName').value = user.data.name;
            document.getElementById('editEmail').value = user.data.email;
            document.getElementById('editPhoneNo').value = user.data.phoneNumber;
            document.getElementById('editIdNumber').value = user.data.idNumber;
            $('#editUserdModel').modal('show');
        })
        .catch(error => console.error('Error fetching user:', error));
}


function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const jwtToken = localStorage.getItem('jwt');
        fetch(`https://megaback-production.up.railway.app/api/admin/delete-user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                if (response.status === 403 || response.status === 401) {
                    window.location.href = 'unauthorized.html';
                } else {
                    return response.json(); // Only parse JSON here
                }
            })
            .then(data => {
                alert(data.message);
                location.reload();
            })
            .catch(error => console.error('Error:', error));
    }
}