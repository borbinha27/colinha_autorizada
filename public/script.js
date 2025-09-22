// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // Exibir informações do usuário logado
    const userInfo = document.createElement('div');
    userInfo.style.cssText = 'position: absolute; top: 10px; right: 10px; background: #f0f0f0; padding: 10px; border-radius: 5px;';
    userInfo.innerHTML = `Usuário: ${user.username} | <button onclick="logout()">Sair</button>`;
    document.body.insertBefore(userInfo, document.body.firstChild);

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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
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
    
    // Evento do botão cancelar
    cancelBtn.addEventListener('click', () => {
        resetForm();
    });
    
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
                alunosList.innerHTML = '<p>Erro ao carregar alunos. Verifique o console.</p>';
            });
    }
    
    // Função para exibir alunos na lista (CORRIGIDA)
    function exibirAlunos(alunos) {
        alunosList.innerHTML = '';
        
        if (!alunos || alunos.length === 0) {
            alunosList.innerHTML = '<p>Nenhum aluno cadastrado.</p>';
            return;
        }
        
        alunos.forEach(aluno => {
            const alunoDiv = document.createElement('div');
            alunoDiv.className = 'aluno-item';
            alunoDiv.innerHTML = `
                <p><strong>Nome:</strong> ${aluno.nome}</p>
                <p><strong>CPF:</strong> ${aluno.cpf}</p>
                <p><strong>Telefone:</strong> ${aluno.telefone}</p>
                <p><strong>E-mail:</strong> ${aluno.email}</p>
                <p><strong>Matrícula:</strong> ${aluno.matricula}</p>
                <p><strong>Aluno:</strong> ${aluno.aluno}</p>
                <p><strong>Escola:</strong> ${aluno.escola}</p>
                <div class="aluno-actions">
                    <button class="edit-btn" data-id="${aluno.id}">Editar</button>
                    <button class="delete-btn" data-id="${aluno.id}">Excluir</button>
                </div>
            `;
            
            alunosList.appendChild(alunoDiv);
        });
        
        // Adicionar eventos aos botões (CORRIGIDO)
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                editarAluno(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                excluirAluno(id);
            });
        });
    }
    
    // Função para adicionar aluno (CORRIGIDA)
    function adicionarAluno(aluno) {
        fetchAuth('/api/alunos', {
            method: 'POST',
            body: JSON.stringify(aluno)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            carregarAlunos();
            resetForm();
            alert('Aluno adicionado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao adicionar aluno:', error);
            alert('Erro ao adicionar aluno. Verifique o console.');
        });
    }
    
    // Função para editar aluno (CORRIGIDA)
    function editarAluno(id) {
        fetchAuth(`/api/alunos/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(aluno => {
                preencherFormulario(aluno);
                editMode = true;
                formTitle.textContent = 'Editar Aluno';
                submitBtn.textContent = 'Atualizar';
                cancelBtn.style.display = 'inline-block';
            })
            .catch(error => {
                console.error('Erro ao carregar aluno para edição:', error);
                alert('Erro ao carregar aluno para edição.');
            });
    }
    
    // Função para atualizar aluno (CORRIGIDA)
    function atualizarAluno(id, aluno) {
        fetchAuth(`/api/alunos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(aluno)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            carregarAlunos();
            resetForm();
            alert('Aluno atualizado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao atualizar aluno:', error);
            alert('Erro ao atualizar aluno.');
        });
    }
    
    // Função para excluir aluno (CORRIGIDA)
    function excluirAluno(id) {
        if (confirm('Tem certeza que deseja excluir este aluno?')) {
            fetchAuth(`/api/alunos/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(() => {
                carregarAlunos();
                alert('Aluno excluído com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao excluir aluno:', error);
                alert('Erro ao excluir aluno.');
            });
        }
    }
    
    // Função para preencher o formulário com dados do aluno
    function preencherFormulario(aluno) {
        document.getElementById('nome').value = aluno.nome || '';
        document.getElementById('cpf').value = aluno.cpf || '';
        document.getElementById('telefone').value = aluno.telefone || '';
        document.getElementById('email').value = aluno.email || '';
        document.getElementById('matricula').value = aluno.matricula || '';
        document.getElementById('aluno').value = aluno.aluno || '';
        document.getElementById('escola').value = aluno.escola || '';
        alunoId.value = aluno.id || '';
    }
    
    // Função para resetar o formulário
    function resetForm() {
        alunoForm.reset();
        alunoId.value = '';
        editMode = false;
        formTitle.textContent = 'Adicionar Novo Aluno';
        submitBtn.textContent = 'Salvar';
        cancelBtn.style.display = 'none';
    }
});

// Função de logout global
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}