const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/gerar-texto', (req, res) => {
  const { primeira, segunda } = req.body;

  const texto = `
${new Date().toLocaleDateString('pt-BR')}

Disciplina: ${primeira.disciplina || ''}
Objeto do conhecimento: ${primeira.objeto}
Habilidade: ${primeira.habilidade}

Disciplina: ${segunda.disciplina || ''}
Objeto do conhecimento: ${segunda.objeto}
Habilidade: ${segunda.habilidade}


Disciplina: ${primeira.disciplina || ''}

Procedimentos Metodológicos:
${primeira.procedimento}

Atividades Realizadas:
${primeira.atividades}


Disciplina: ${segunda.disciplina || ''}

Procedimentos Metodológicos:
${segunda.procedimento}

Atividades Realizadas:
${segunda.atividades}
`.trim();

  res.json({ texto });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
