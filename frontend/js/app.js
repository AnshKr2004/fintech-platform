const apiUrl = 'http://localhost:3000/api/users';

async function createUser() {
    const name = document.getElementById('username').value;
    const initialBalance = parseFloat(document.getElementById('initialBalance').value);
    
    if (name === "" || isNaN(initialBalance)) {
      alert('Please provide valid inputs');
      return;
    }
  
    const user = { name, balance: initialBalance };
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      const data = await response.json();
      alert(`User created with ID: ${data.id}`);
      loadUsers();
    } catch (error) {
      alert('Error creating user');
    }
  }
  
  async function loadUsers() {
    try {
      const response = await fetch(apiUrl);
      const users = await response.json();
      const userList = document.getElementById('userList');
      userList.innerHTML = '';
      users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `ID: ${user.id}, Name: ${user.name}, Balance: ${user.balance}`;
        userList.appendChild(li);
      });
    } catch (error) {
      alert('Error loading users');
    }
  }
  
  async function deposit() {
    const userId = parseInt(document.getElementById('userId').value);
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (isNaN(userId) || isNaN(amount)) {
      alert('Please provide valid inputs');
      return;
    }
  
    try {
      const response = await fetch(`${apiUrl}/${userId}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });
      const data = await response.json();
      alert(`New balance for User ID ${data.id}: ${data.balance}`);
      loadUsers();
    } catch (error) {
      alert('Error making deposit');
    }
  }
  
  async function withdraw() {
    const userId = parseInt(document.getElementById('userId').value);
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (isNaN(userId) || isNaN(amount)) {
      alert('Please provide valid inputs');
      return;
    }
  
    try {
      const response = await fetch(`${apiUrl}/${userId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });
      const data = await response.json();
      alert(`New balance for User ID ${data.id}: ${data.balance}`);
      loadUsers();
    } catch (error) {
      alert('Error making withdrawal');
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadUsers);
  
