const GRAPHQL_ENDPOINT = "https://testing-graphql.onrender.com/graphql";

// Função genérica para enviar requisições GraphQL
async function executarGraphQL(query) {
  const resposta = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const json = await resposta.json();
  if (json.errors) throw new Error(json.errors[0]?.message || "Erro no GraphQL");
  return json.data;
}

// Utilitário para exibir status
function definirStatus(mensagem, tipo = "loading") {
  const statusEl = document.getElementById("status");
  statusEl.className = `status-msg ${tipo}`;
  statusEl.textContent = mensagem;
}

// 1. Consulta de Alunos: Nome, E-mail e Nome do Curso
async function carregarAlunos() {
  const lista = document.getElementById("lista-alunos");
  lista.innerHTML = "<li>Carregando...</li>";
  definirStatus("Carregando alunos...", "loading");

  const QUERY_ALUNOS = `
    query {
      students {
        id
        name
        email
        course {
          name
        }
      }
    }
  `;

  try {
    const data = await executarGraphQL(QUERY_ALUNOS);
    lista.innerHTML = data.students
      .map(
        (a) => `
        <li>
          <strong>${a.name}</strong><br />
          <span>📧 ${a.email}</span><br />
          <span>🎓 Curso: ${a.course ? a.course.name : "Nenhum"}</span>
        </li>`
      )
      .join("");
    definirStatus("Alunos carregados com sucesso!", "success");
  } catch (erro) {
    lista.innerHTML = `<li style="color:red">Erro ao carregar alunos.</li>`;
    definirStatus(`Erro: ${erro.message}`, "error");
  }
}

// 2. Consulta de Cursos: Nome, Créditos e Nomes dos Alunos
async function carregarCursos() {
  const lista = document.getElementById("lista-cursos");
  lista.innerHTML = "<li>Carregando...</li>";
  definirStatus("Carregando cursos...", "loading");

  const QUERY_CURSOS = `
    query {
      courses {
        id
        name
        credits
        students {
          name
        }
      }
    }
  `;

  try {
    const data = await executarGraphQL(QUERY_CURSOS);
    lista.innerHTML = data.courses
      .map(
        (c) => `
        <li>
          <strong>${c.name}</strong> (${c.credits} créditos)
          <div class="sub-list">
            <strong>Alunos:</strong>
            ${
              c.students && c.students.length > 0
                ? c.students.map((s) => s.name).join(", ")
                : "Nenhum aluno matriculado"
            }
          </div>
        </li>`
      )
      .join("");
    definirStatus("Cursos carregados com sucesso!", "success");
  } catch (erro) {
    lista.innerHTML = `<li style="color:red">Erro ao carregar cursos.</li>`;
    definirStatus(`Erro: ${erro.message}`, "error");
  }
}

// 3. Consulta de Professores: Nome e Matérias/Cursos
async function carregarProfessores() {
  const lista = document.getElementById("lista-professores");
  lista.innerHTML = "<li>Carregando...</li>";
  definirStatus("Carregando professores...", "loading");

  const QUERY_PROFESSORES = `
    query {
      teachers {
        id
        name
        courses {
          name
        }
      }
    }
  `;

  try {
    const data = await executarGraphQL(QUERY_PROFESSORES);
    lista.innerHTML = data.teachers
      .map(
        (p) => `
        <li>
          <strong>${p.name}</strong>
          <div class="sub-list">
            <strong>Leciona:</strong>
            ${
              p.courses && p.courses.length > 0
                ? p.courses.map((c) => c.name).join(", ")
                : "Nenhum curso atribuído"
            }
          </div>
        </li>`
      )
      .join("");
    definirStatus("Professores carregados com sucesso!", "success");
  } catch (erro) {
    lista.innerHTML = `<li style="color:red">Erro ao carregar professores.</li>`;
    definirStatus(`Erro: ${erro.message}`, "error");
  }
}

// Função para carregar todas as consultas simultaneamente
async function carregarTodos() {
  definirStatus("Carregando todas as consultas...", "loading");
  await Promise.all([carregarAlunos(), carregarCursos(), carregarProfessores()]);
  definirStatus("Todos os dados foram carregados!", "success");
}

// Carrega automaticamente ao abrir a página
carregarTodos();
