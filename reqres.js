document.addEventListener('DOMContentLoaded', function () {
    loadUsers();
});

function loadUsers() {
    fetch('https://reqres.in/api/users?page=1')
        .then(response => response.json())
        .then(data => {
            const users = data.data;
            const userTableBody = document.getElementById('userTableBody');
            userTableBody.innerHTML = ''; // Clear table before inserting rows

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td><img src="${user.avatar}" alt="" style="width:50px; border-radius:60px;"></td>
            <td>${user.id}</td>
            <td>${user.first_name} ${user.last_name}</td>
            <td>${user.email}</td>
            <td>Active</td>
            <td><button class="edit" onclick="editUser(${user.id})"><i class="fa fa-pencil"></i></button></td>
            <td><button class="btn-trash" onclick="confirmDeleteUser(${user.id})"><i class="fa fa-trash"></i></button></td>
        `;
                userTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}


function editUser(userId) {
    fetch(`https://reqres.in/api/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            const user = data.data;
            document.getElementById('userName').value = user.first_name;
            document.getElementById('userLname').value = user.last_name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userAvatar').src = user.avatar;
            document.getElementById('saveBtn').onclick = function (event) {
                event.preventDefault(); updateUser(userId);
            };
            document.getElementById('myModal').style.display = "block";
        });
}

function updateUser(userId) {
    const firstName = document.getElementById('userName').value;
    const lastName = document.getElementById('userLname').value;
    const fullName = `${firstName} ${lastName}`
    const email = document.getElementById('userEmail').value;

    console.log('Updating user:', { userId, firstName, lastName, email });

    fetch(`https://reqres.in/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            email: email,
            name: fullName
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('User updated:', data);
            closeModal();
            loadUsers(); // Reload users to reflect changes on the UI
        })
        .catch(error => console.error('Error updating user:', error));
}

function confirmDeleteUser(userId) {
    document.getElementById('delModal').style.display = 'block';
    document.getElementById('confirmDeleteBtn').onclick = function () {
        deleteUser(userId);
    };
}

function deleteUser(userId) {
    fetch(`https://reqres.in/api/users/${userId}`, {
        method: 'DELETE'
    }).then(() => {
        closeDeleteModal();
        loadUsers();
    });
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

function closeDeleteModal() {
    document.getElementById('delModal').style.display = 'none';
}