document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const messageDiv = document.getElementById('message');

  // Verificar se o usuário já está logado
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = '/';
  }

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validações básicas no frontend
    if (password !== confirmPassword) {
      showMessage('As senhas não coincidem!', 'red');
      return;
    }
    
    if (password.length < 6) {
      showMessage('A senha deve ter pelo menos 6 caracteres!', 'red');
      return;
    }
    
    if (username.length < 3) {
      showMessage('O usuário deve ter pelo menos 3 caracteres!', 'red');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          username, 
          password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('Cadastro realizado com sucesso! Redirecionando para login...', 'green');
        
        // Limpar formulário
        registerForm.reset();
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      } else {
        showMessage(data.error || 'Erro ao realizar cadastro', 'red');
      }
    } catch (error) {
      showMessage('Erro de conexão. Tente novamente.', 'red');
    }
  });
  
  function showMessage(message, color) {
    messageDiv.textContent = message;
    messageDiv.style.color = color;
    
    // Limpar mensagem após 5 segundos
    setTimeout(() => {
      messageDiv.textContent = '';
    }, 5000);
  }
});