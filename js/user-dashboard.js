document.addEventListener('DOMContentLoaded', function () {
    const jwtToken = localStorage.getItem('jwt'); // Get JWT token from local storage
    const jobTableBody = document.getElementById('job-table-body');

    // Fetch jobs from the API
    fetch('http://localhost:8080/api/employee/get-all-job', {
        method: 'GET',
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
            if (data.code === 200) {
                populateJobTable(data.data);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));



    // Add new job
    document.getElementById('add-job-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const newJob = {
            customerName: document.getElementById('customerName').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            phoneModel: document.getElementById('phoneModel').value,
            fault: document.getElementById('fault').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            hasBackCover: document.getElementById('hasBackCover').checked,
            hasMemoryCard: document.getElementById('hasMemoryCard').checked,
            hasSimCard: document.getElementById('hasSimCard').checked,
            status: document.getElementById('jobStatus').value,
        };

        fetch('http://localhost:8080/api/employee/save-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(newJob)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                $('#addJobModal').modal('hide'); // Hide the modal
                location.reload(); // Reload the page to refresh the job table
            })
            .catch(error => console.error('Error:', error));
    });


    document.getElementById('edit-job-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const jobId = document.getElementById('editJobId').value;

        const updatedJob = {
            id: jobId,
            customerName: document.getElementById('editCustomerName').value,
            phoneNumber: document.getElementById('editPhoneNumber').value,
            phoneModel: document.getElementById('editPhoneModel').value,
            fault: document.getElementById('editFault').value,
            price: document.getElementById('editPrice').value,
            description: document.getElementById('editDescription').value,
            hasBackCover: document.getElementById('editHasBackCover').checked,
            hasMemoryCard: document.getElementById('editHasMemoryCard').checked,
            hasSimCard: document.getElementById('editHasSimCard').checked,
            status: document.getElementById('editJobStatus').value
        };

        fetch(`http://localhost:8080/api/employee/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(updatedJob)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                $('#editJobModal').modal('hide');
                reloadData();
            })
            .catch(error => console.error('Error updating job:', error));
    });


    document.getElementById('edit-status-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const jobId = document.getElementById('statusJobId').value;

        const statusMarkJob = {
            id: jobId,
            status: document.getElementById('stausJobStatus').value
        };

        fetch(`http://localhost:8080/api/employee/job-repair`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(statusMarkJob)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                $('#editStatusModal').modal('hide');
                reloadData();
            })
            .catch(error => console.error('Error updating job:', error));
    });



});


function reloadData() {
    const jwtToken = localStorage.getItem('jwt'); // Get JWT token from local storage
    const jobTableBody = document.getElementById('job-table-body');

    // Fetch jobs from the API
    fetch('http://localhost:8080/api/employee/get-all-job', {
        method: 'GET',
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
            if (data.code === 200) {
                populateJobTable(data.data);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function populateJobTable(jobs) {
    const jobTableBody = document.getElementById('job-table-body');
    const userRole = localStorage.getItem('userRole');
    jobTableBody.innerHTML = ''; // Clear existing table rows


    if (!Array.isArray(jobs)) {
        jobs = [jobs]; // Wrap single job in an array
    }

    jobs.forEach(job => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${job.id}</td>
            <td>${job.customerName}</td>
            <td>${job.phoneNumber}</td>
            <td>${job.phoneModel}</td>
            <td>${job.fault}</td>
            <td>${job.price}.00</td>
            <td>${job.description}</td>
            <td>${job.jobAddedAt}</td>
            <td>${job.jobReleaseAt}</td>
            <td>${job.hasBackCover ? 'Yes' : 'No'}</td>
            <td>${job.hasMemoryCard ? 'Yes' : 'No'}</td>
            <td>${job.hasSimCard ? 'Yes' : 'No'}</td>
            <td>${job.jobAddedBy}</td>
            <td>${job.repairedBy}</td>
            <td>${job.status}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="markAsRepaired(${job.id})">Mark As Repaired or Check</button>
                <button class="btn btn-warning btn-sm" onclick="editJob(${job.id})">Edit</button>
                <button class="btn btn-success btn-sm" onclick="pay(${job.id})">Pay</button>
                ${userRole === 'ADMIN' ? `<button class="btn btn-danger btn-sm" onclick="deleteJob(${job.id})">Delete</button>` : ''}
            </td>
        `;
        jobTableBody.appendChild(row);
    });
}

function filterJobsByStatus() {
    const status = document.getElementById('statusFilter').value;
    const jwtToken = localStorage.getItem('jwt'); // Get JWT token from local storage
    const url = status === 'all' ? 'http://localhost:8080/api/employee/get-all-job' : `http://localhost:8080/api/employee/filter-by-status/${status}`;

    fetch(url, {
        method: 'GET',
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
            if (data.code === 200) {
                populateJobTable(data.data);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}



function searchJobs() {
    const jwtToken = localStorage.getItem('jwt'); // Get JWT token from local storage
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value;
    const userRole = localStorage.getItem('userRole');
    let apiUrl = '';

    if (searchType === 'id') {
        const searchInputInt = parseInt(searchInput, 10);
        apiUrl = `http://localhost:8080/api/employee/search/${searchInputInt}`;
    } else if (searchType === 'customerName') {
        apiUrl = `http://localhost:8080/api/employee/search-by-name/${searchInput}`;
    } else if (searchType === 'receivedDate') {
        apiUrl = `http://localhost:8080/api/employee/search-by-date/${searchInput}`;
    } else if (searchType === 'phoneNumber') {
        apiUrl = `http://localhost:8080/api/employee/search-by-phone-number/${searchInput}`;
    } else if (searchType === 'phoneModel') {
        apiUrl = `http://localhost:8080/api/employee/search-by-phone-model/${searchInput}`;
    }

    fetch(apiUrl, {
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
            console.log(data);
            if (data.code === 200) {
                populateJobTable(data.data);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}



function editJob(jobId) {
    const jwtToken = localStorage.getItem('jwt');
    fetch(`http://localhost:8080/api/employee/search/${jobId}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
        .then(response => response.json())
        .then(job => {
            document.getElementById('editJobId').value = job.data.id;
            document.getElementById('editCustomerName').value = job.data.customerName;
            document.getElementById('editPhoneNumber').value = job.data.phoneNumber;
            document.getElementById('editPhoneModel').value = job.data.phoneModel;
            document.getElementById('editFault').value = job.data.fault;
            document.getElementById('editPrice').value = job.data.price;
            document.getElementById('editDescription').value = job.data.description;
            document.getElementById('editJobStatus').value = job.data.status;
            document.getElementById('editHasBackCover').checked = job.data.hasBackCover;
            document.getElementById('editHasMemoryCard').checked = job.data.hasMemoryCard;
            document.getElementById('editHasSimCard').checked = job.data.hasSimCard;

            $('#editJobModal').modal('show');
        })
        .catch(error => console.error('Error fetching job:', error));
}


function markAsRepaired(jobId) {
    const jwtToken = localStorage.getItem('jwt');
    fetch(`http://localhost:8080/api/employee/search/${jobId}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
        .then(response => response.json())
        .then(job => {
            document.getElementById('statusJobId').value = job.data.id;
            document.getElementById('statusCustomerName').value = job.data.customerName;
            document.getElementById('statusPhoneModel').value = job.data.phoneModel;
            document.getElementById('stausJobStatus').value = job.data.status;
            $('#editStatusModal').modal('show');
        })
        .catch(error => console.error('Error fetching job:', error));
}


function pay(jobId){
    const jwtToken = localStorage.getItem('jwt');
    fetch(`http://localhost:8080/api/employee/search/${jobId}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
        .then(response => response.json())
        .then(job => {
            const isRepaired = job.data.repairedBy;
            const jobStatus = job.data.status;
            const jobRelease = job.data.jobReleaseAt;
            if (isRepaired === null){
                alert("Firstly you must mark repaired or checked");
            }else{
                if(jobStatus === "PAID"){
                    alert("This job has allready paid");
                }else{
                    if(jobRelease === null){
                        payJob(jobId);
                    }
                    else{
                        alert("This job already has release date");
                    }
                    
                }
            }
            
        })
        .catch(error => console.error('Error fetching job:', error));
}


function payJob(jobId) {
    if (confirm('Are you sure you want to pay for this job?')) {
        const jwtToken = localStorage.getItem('jwt');
        fetch(`http://localhost:8080/api/employee/pay/${jobId}`, {
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
                alert(data.message);
                reloadData(); // Reload the page to refresh the job table
            })
            .catch(error => console.error('Error:', error));
    }
}





function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        const jwtToken = localStorage.getItem('jwt'); // Get JWT token from local storage
        fetch(`http://localhost:8080/api/admin/delete-job/${jobId}`, {
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
                reloadData();// Reload the page to refresh the job table
            })
            .catch(error => console.error('Error:', error));
    }
}