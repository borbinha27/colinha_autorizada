// public/login.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const messageDiv = document.getElementById('message');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Salvar token no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirecionar para a página principal
        window.location.href = '/';
      } else {
        messageDiv.textContent = data.error;
        messageDiv.style.color = 'red';
      }
    } catch (error) {
      messageDiv.textContent = 'Erro ao fazer login';
      messageDiv.style.color = 'red';
    }
  });
});