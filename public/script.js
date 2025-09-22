// script.js (modificado)
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se o usuário está logado
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    window.location.href = '/login';
    return;
  }

  // Resto do código permanece igual, mas vamos adicionar o token nas requisições
  const alunoForm = document.getElementById('alunoForm');
  const formTitle = document.getElementById('formTitle');
  const alunoId = document.getElementById('alunoId');
  const submitBtn = document.getElementById('submitBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const alunosList = document.getElementById('alunosList');
  
  let editMode = false;
  
  // Função para fazer requisições autenticadas
  const fetchAuth = (url, options = {}) => {
    const token = localStorage.getItem('token');
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
    return fetch(url, options);
  };
  
  // Carregar alunos ao iniciar
  carregarAlunos();
  
  // Evento de submit do formulário
  alunoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const aluno = {
      nome: document.getElementById('nome').value,
      cpf: document.getElementById('cpf').value,
      telefone: document.getElementById('telefone').value,
      email: document.getElementById('email').value,
      matricula: document.getElementById('matricula').value,
      aluno: document.getElementById('aluno').value,
      escola: document.getElementById('escola').value
    };
    
    if (editMode) {
      atualizarAluno(alunoId.value, aluno);
    } else {
      adicionarAluno(aluno);
    }
  });
  
  // Resto do código permanece similar, mas substituindo fetch por fetchAuth
  // Função para carregar alunos
  function carregarAlunos() {
    fetchAuth('/api/alunos')
      .then(response => {
        if (response.status === 401) {
          // Token inválido, redirecionar para login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        return response.json();
      })
      .then(data => {
        exibirAlunos(data);
      })
      .catch(error => {
        console.error('Erro ao carregar alunos:', error);
      });
  }
  
  // Modificar todas as funções de fetch para usar fetchAuth
  function adicionarAluno(aluno) {
    fetchAuth('/api/alunos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(aluno)
    })
    .then(response => response.json())
    .then(data => {
      carregarAlunos();
      resetForm();
    })
    .catch(error => console.error('Erro ao adicionar aluno:', error));
  }
  
  // ... (modificar as outras funções de mesma forma)
});