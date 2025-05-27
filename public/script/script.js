document.addEventListener("DOMContentLoaded", () => {
  fetch("dados/dados.json")
    .then((response) => response.json())
    .then((dados) => {
      window._dadosJSON = dados;
      configurarTema();
      configurarReconhecimentoVoz();
      carregarItensPersonalizados();

      preencherDisciplinasEm(document.getElementById("disciplina"), dados);
      configurarEventos(dados);
    })
    .catch((error) => console.error("Erro ao carregar os dados:", error));
});

function configurarTema() {
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });
}

function configurarReconhecimentoVoz() {
  document.querySelectorAll("textarea").forEach((area) => {
    const jaTemBotao = area.parentElement.querySelector(
      `button[data-mic="${area.id}"]`
    );
    if (jaTemBotao) return;

    const botao = document.createElement("button");
    botao.textContent = "🎤";
    botao.setAttribute("data-mic", area.id);
    botao.style.position = "absolute";
    botao.style.bottom = "8px";
    botao.style.right = "5px";
    botao.style.padding = "4px 8px";
    botao.style.fontSize = "12px";
    botao.style.cursor = "pointer";

    const wrapper =
      area.closest('div[style*="position"]') || area.parentElement;
    wrapper.style.position = "relative";

    botao.onclick = () => startRecognition(area.id);
    wrapper.appendChild(botao);
  });
}

function startRecognition(id) {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Reconhecimento de voz não suportado neste navegador.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    const campo = document.getElementById(id);
    campo.value += (campo.value ? "\n" : "") + transcript;
  };
  recognition.start();
}

function preencherDisciplinasEm(selectElement, dados) {
  selectElement.innerHTML =
    '<option value="">Selecione uma disciplina</option>';
  Object.keys(dados).forEach((nome) => {
    const option = document.createElement("option");
    option.value = nome;
    option.textContent = nome;
    selectElement.appendChild(option);
  });
}

function configurarEventos(dados) {
  document.getElementById("disciplina").addEventListener("change", function () {
    const disciplina = this.value;
    if (!disciplina || !dados[disciplina]) return;

    document.getElementById("selecao-habilidade").classList.remove("hidden");
    document.getElementById("selecao-objeto").classList.remove("hidden");
    document.getElementById("selecao-procedimento").classList.remove("hidden");

    preencherHabilidades(dados[disciplina].habilidades);
    preencherObjetos(dados[disciplina].objetos_conhecimento);
    preencherProcedimentos(dados[disciplina].procedimentos);
    preencherAtividades(dados[disciplina].atividades);
  });
}

function preencherHabilidades(habilidades) {
  const select = document.getElementById("habilidade");
  const textarea = document.getElementById("habilidade-selecionada");
  select.innerHTML = '<option value="">Selecione uma habilidade</option>';

  habilidades.forEach((hab) => {
    const option = document.createElement("option");
    option.value = hab.texto;
    option.textContent = hab.texto;
    select.appendChild(option);
  });

  select.classList.remove("hidden");
  select.onchange = () => {
    textarea.value = select.value;
  };
}

function preencherObjetos(objetos) {
  const select = document.getElementById("objetosPredefinidos");
  const textarea = document.getElementById("objeto");
  select.innerHTML =
    '<option value="">Selecione um objeto do conhecimento</option>';

  objetos.forEach((obj) => {
    const option = document.createElement("option");
    option.value = obj;
    option.textContent = obj;
    select.appendChild(option);
  });

  select.classList.remove("hidden");
  select.onchange = () => {
    if (textarea.value) textarea.value += "\n";
    textarea.value += select.value;
  };
}

function preencherProcedimentos(procedimentos) {
  const select = document.getElementById("procedimentosPredefinidos");
  const textarea = document.getElementById("procedimento");
  select.innerHTML = '<option value="">Selecione um procedimento</option>';

  procedimentos.forEach((proc) => {
    const option = document.createElement("option");
    option.value = proc;
    option.textContent = proc;
    select.appendChild(option);
  });

  select.classList.remove("hidden");
  select.onchange = () => {
    if (textarea.value) textarea.value += "\n";
    textarea.value += select.value;
  };
}

function preencherAtividades(atividades) {
  const select = document.getElementById("atividadesPredefinidas");
  const textarea = document.getElementById("atividades");
  select.innerHTML = '<option value="">Selecione uma atividade</option>';

  atividades.forEach((atividade) => {
    const option = document.createElement("option");
    option.value = atividade;
    option.textContent = atividade;
    select.appendChild(option);
  });

  select.onchange = () => {
    if (textarea.value) textarea.value += "\n";
    textarea.value += select.value;
  };
}

function preencherHabilidadesPersonalizado(sufixo, habilidades) {
  const select = document.getElementById("habilidade" + sufixo);
  const textarea = document.getElementById("habilidade-selecionada" + sufixo);
  select.innerHTML = '<option value="">Selecione uma habilidade</option>';

  habilidades.forEach((hab) => {
    const option = document.createElement("option");
    option.value = hab.texto;
    option.textContent = hab.texto;
    select.appendChild(option);
  });

  select.classList.remove("hidden");
  select.onchange = () => {
    textarea.value = select.value;
  };
}

function preencherObjetosPersonalizado(sufixo, objetos) {
  const select = document.getElementById("objetosPredefinidos" + sufixo);
  const textarea = document.getElementById("objeto" + sufixo);
  select.innerHTML =
    '<option value="">Selecione um objeto do conhecimento</option>';

  objetos.forEach((obj) => {
    const option = document.createElement("option");
    option.value = obj;
    option.textContent = obj;
    select.appendChild(option);
  });

  select.classList.remove("hidden");
  select.onchange = () => {
    if (textarea.value) textarea.value += "\n";
    textarea.value += select.value;
  };
}

function preencherProcedimentosPersonalizado(sufixo, procedimentos) {
  const select = document.getElementById("procedimentosPredefinidos" + sufixo);
  const textarea = document.getElementById("procedimento" + sufixo);
  select.innerHTML = '<option value="">Selecione um procedimento</option>';

  procedimentos.forEach((proc) => {
    const option = document.createElement("option");
    option.value = proc;
    option.textContent = proc;
    select.appendChild(option);
  });

  select.classList.remove("hidden");
  select.onchange = () => {
    if (textarea.value) textarea.value += "\n";
    textarea.value += select.value;
  };
}

function preencherAtividadesPersonalizado(sufixo, atividades) {
  const select = document.getElementById("atividadesPredefinidas" + sufixo);
  const textarea = document.getElementById("atividades" + sufixo);
  select.innerHTML = '<option value="">Selecione uma atividade</option>';

  atividades.forEach((atividade) => {
    const option = document.createElement("option");
    option.value = atividade;
    option.textContent = atividade;
    select.appendChild(option);
  });

  select.onchange = () => {
    if (textarea.value) textarea.value += "\n";
    textarea.value += select.value;
  };
}

document
  .getElementById("btnSegundaDisciplina")
  .addEventListener("click", () => {
    const container = document.querySelector(".container");

    const blocoDisciplina2 = document
      .querySelector(".data-disciplina-card")
      .cloneNode(true);
    
    const campoData = blocoDisciplina2.querySelector('#data');
    const labelData = blocoDisciplina2.querySelector('label[for="data"]');
    const divData = blocoDisciplina2.querySelector('div:has(#data)');
    
    blocoDisciplina2.querySelectorAll('*').forEach(elemento => {
      if (elemento.id === 'data' || 
          elemento.getAttribute('for') === 'data' ||
          elemento.textContent?.includes('📅') ||
          elemento.textContent?.includes('Data da Aula')) {
        elemento.remove();
      }
    });
    
    blocoDisciplina2.querySelectorAll('*').forEach(elemento => {
      if (elemento.textContent && elemento.textContent.includes('📅')) {
        elemento.remove();
      }
    });
    
    const selectDisciplina2 = blocoDisciplina2.querySelector("#disciplina");
    const novaId = "disciplina2";
    selectDisciplina2.id = novaId;
    
    const labelDisciplina = blocoDisciplina2.querySelector("label");
    if (labelDisciplina) {
      labelDisciplina.textContent = "Disciplina (2ª Disciplina)";
      labelDisciplina.setAttribute('for', 'disciplina2');
    }
    
    selectDisciplina2.selectedIndex = 0;

    preencherDisciplinasEm(selectDisciplina2, window._dadosJSON);
    container.insertBefore(
      blocoDisciplina2,
      document.getElementById("btnSegundaDisciplina")
    );

    const cloneBloco = (id, tituloExtra, newIds) => {
      const bloco = document.getElementById(id).cloneNode(true);
      bloco.id += "-2";
      bloco.querySelector("h2").textContent += ` ${tituloExtra}`;

      Object.entries(newIds).forEach(([oldId, newId]) => {
        const elemento = bloco.querySelector(`#${oldId}`);
        if (elemento) {
          elemento.id = newId;
          if (elemento.tagName === "SELECT") {
            elemento.selectedIndex = 0;
          }
          if (elemento.tagName === "TEXTAREA") {
            elemento.value = "";
          }
        }
      });

      return bloco;
    };

    container.insertBefore(
      cloneBloco("selecao-habilidade", "(2ª Disciplina)", {
        habilidade: "habilidade2",
        "habilidade-selecionada": "habilidade-selecionada2",
      }),
      document.getElementById("btnSegundaDisciplina")
    );

    container.insertBefore(
      cloneBloco("selecao-objeto", "(2ª Disciplina)", {
        objetosPredefinidos: "objetosPredefinidos2",
        objeto: "objeto2",
      }),
      document.getElementById("btnSegundaDisciplina")
    );

    container.insertBefore(
      cloneBloco("selecao-procedimento", "(2ª Disciplina)", {
        procedimentosPredefinidos: "procedimentosPredefinidos2",
        procedimento: "procedimento2",
      }),
      document.getElementById("btnSegundaDisciplina")
    );

    const atividadesBloco = document
      .querySelector(".atividades-container")
      .parentNode.cloneNode(true);
    atividadesBloco.querySelector("h2").textContent += " (2ª Disciplina)";
    atividadesBloco.querySelector("#atividadesPredefinidas").id =
      "atividadesPredefinidas2";
    atividadesBloco.querySelector("#atividades").id = "atividades2";
    container.insertBefore(
      atividadesBloco,
      document.getElementById("btnSegundaDisciplina")
    );

    document.getElementById("btnSegundaDisciplina").style.display = "none";
    const btnGerarTexto = document.getElementById("btnGerarTexto");
    btnGerarTexto.disabled = false;
    
    btnGerarTexto.style.display = "block";
    btnGerarTexto.style.margin = "20px auto";
    btnGerarTexto.style.textAlign = "center";

    configurarReconhecimentoVoz();

    selectDisciplina2.addEventListener("change", function () {
      const disciplina = this.value;
      const dados = window._dadosJSON;

      if (!disciplina || !dados[disciplina]) return;

      document
        .getElementById("selecao-habilidade-2")
        .classList.remove("hidden");
      document.getElementById("selecao-objeto-2").classList.remove("hidden");
      document
        .getElementById("selecao-procedimento-2")
        .classList.remove("hidden");

      preencherHabilidadesPersonalizado("2", dados[disciplina].habilidades);
      preencherObjetosPersonalizado(
        "2",
        dados[disciplina].objetos_conhecimento
      );
      preencherProcedimentosPersonalizado("2", dados[disciplina].procedimentos);
      preencherAtividadesPersonalizado("2", dados[disciplina].atividades);
    });
  });


function removerEmojis(texto) {
  return texto.replace(
    /[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ""
  );
}

document.getElementById("btnGerarTexto").addEventListener("click", () => {
  const dataElement = document.getElementById("data");
  const dataValue = dataElement ? dataElement.value : '';
  
  if (!dataValue || dataValue.trim() === '') {
    alert('Por favor, preencha a data da aula antes de gerar o texto.');
    dataElement.focus();
    return;
  }

  const primeira = {
    habilidade: document.getElementById("habilidade-selecionada")?.value || "",
    objeto: document.getElementById("objeto")?.value || "",
    procedimento: document.getElementById("procedimento")?.value || "",
    atividades: document.getElementById("atividades")?.value || "",
  };

  const segunda = {
    habilidade: document.getElementById("habilidade-selecionada2")?.value || "",
    objeto: document.getElementById("objeto2")?.value || "",
    procedimento: document.getElementById("procedimento2")?.value || "",
    atividades: document.getElementById("atividades2")?.value || "",
  };

  const data = dataValue;

  const resultado1 = document.getElementById("resultado1");
  const resultado2 = document.getElementById("resultado2");

  resultado1.value = removerEmojis(
    `
${data}

Disciplina: ${document.getElementById("disciplina")?.value || ""}

Objeto do conhecimento: ${primeira.objeto}

Habilidade: ${primeira.habilidade}


Disciplina: ${document.getElementById("disciplina2")?.value || ""}

Objeto do conhecimento: ${segunda.objeto}

Habilidade: ${segunda.habilidade}


`.trim()
  );

  resultado2.value =
    segunda.habilidade ||
    segunda.objeto ||
    segunda.procedimento ||
    segunda.atividades
      ? removerEmojis(
          `


          
Disciplina: ${document.getElementById("disciplina")?.value || ""}

Procedimentos Metodológicos:
${primeira.procedimento}

Atividades Realizadas:
${primeira.atividades}


Disciplina: ${document.getElementById("disciplina2")?.value || ""}

Procedimentos Metodológicos:
${segunda.procedimento}

Atividades Realizadas:
${segunda.atividades}
`.trim()
        )
      : "";

  document.getElementById("pdf-export").style.display = "block";
});


function mostrarInputNovo(tipo) {
  const idPadrao = {
    habilidade: ["habilidade", "habilidade-selecionada"],
    objeto: ["objetosPredefinidos", "objeto"],
    procedimento: ["procedimentosPredefinidos", "procedimento"],
    atividade: ["atividadesPredefinidas", "atividades"],
  };

  const botao = event.currentTarget;
  const isSegundaDisciplina = botao.closest(".card")?.id?.endsWith("-2");

  const sufixo = isSegundaDisciplina ? "2" : "";

  const selectId = idPadrao[tipo][0] + sufixo;
  const textareaId = idPadrao[tipo][1] + sufixo;

  const select = document.getElementById(selectId);
  const textarea = document.getElementById(textareaId);
  const wrapper = textarea.parentElement;

  if (wrapper.querySelector('input[data-novo="true"]')) return;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Digite um novo ${tipo}...`;
  input.style.marginBottom = "5px";
  input.style.width = "100%";
  input.style.padding = "6px";
  input.setAttribute("data-novo", "true");

  const botoes = document.createElement("div");
  botoes.style.display = "flex";
  botoes.style.gap = "10px";
  botoes.style.marginBottom = "10px";
  botoes.setAttribute("data-novo", "true");

  const botaoAdicionar = document.createElement("button");
  botaoAdicionar.textContent = "Adicionar";
  botaoAdicionar.setAttribute("data-novo", "true");
  botaoAdicionar.onclick = () => {
    const valor = input.value.trim();
    if (!valor) return;

    const jaExiste = Array.from(select.options).some(
      (opt) => opt.value === valor
    );
    if (!jaExiste) {
      const novaOpcao = document.createElement("option");
      novaOpcao.value = valor;
      novaOpcao.textContent = valor;
      select.appendChild(novaOpcao);

      const chave = `itensPersonalizados_${tipo}${sufixo}`;
      const existentes = JSON.parse(localStorage.getItem(chave)) || [];
      existentes.push(valor);
      localStorage.setItem(chave, JSON.stringify(existentes));
    }

    select.value = valor;
    if (tipo === "habilidade") {
      textarea.value = valor;
    } else {
      textarea.value += (textarea.value ? "\n" : "") + valor;
    }

    input.remove();
    botoes.remove();
  };

  const botaoCancelar = document.createElement("button");
  botaoCancelar.textContent = "Cancelar";
  botaoCancelar.style.backgroundColor = "var(--warning-color)";
  botaoCancelar.setAttribute("data-novo", "true");
  botaoCancelar.onclick = () => {
    input.remove();
    botoes.remove();
  };

  botoes.appendChild(botaoAdicionar);
  botoes.appendChild(botaoCancelar);

  wrapper.insertBefore(botoes, textarea);
  wrapper.insertBefore(input, botoes);
}

function carregarItensPersonalizados() {
  const tipos = ["habilidade", "objeto", "procedimento", "atividade"];

  tipos.forEach((tipo) => {
    const chave = `itensPersonalizados_${tipo}`;
    const dados = JSON.parse(localStorage.getItem(chave)) || [];

    const selectId = {
      habilidade: "habilidade",
      objeto: "objetosPredefinidos",
      procedimento: "procedimentosPredefinidos",
      atividade: "atividadesPredefinidas",
    }[tipo];

    const select = document.getElementById(selectId);
    if (!select) return;

    dados.forEach((valor) => {
      const op = document.createElement("option");
      op.value = valor;
      op.textContent = valor;
      select.appendChild(op);
    });
  });
}

function copiarTexto(idTextarea) {
  const texto = document.getElementById(idTextarea).value;

  navigator.clipboard
    .writeText(texto)
    .then(() => mostrarToast("Texto copiado com sucesso!"))
    .catch((err) => mostrarToast("Erro ao copiar o texto"));
}

function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");
  toast.textContent = mensagem;
  toast.style.opacity = 1;

  setTimeout(() => {
    toast.style.opacity = 0;
  }, 2000);
}

function limparTextoPDF(texto) {
  // Remove emojis
  let limpo = texto.replace(
    /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, ''
  );

  limpo = limpo.replace(/[\u200B-\u200D\uFEFF\u202C]/g, '');

  limpo = limpo.replace(/([A-Za-zÀ-ÿ])(?:\s(?=[A-Za-zÀ-ÿ]))/g, '$1');

  limpo = limpo.normalize('NFC');

  return limpo;
}



async function baixarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let nomeArquivo = document.getElementById('nomeArquivo').value.trim();

  if (!nomeArquivo) {
    const dataValue = document.getElementById('data')?.value;
    if (dataValue) {
      const [ano, mes, dia] = dataValue.split('-');
      nomeArquivo = `aula-${dia}-${mes}-${ano}`;
    } else {
      nomeArquivo = 'aula';
    }
  }

  const texto1 = document.getElementById('resultado1').value;
  const texto2 = document.getElementById('resultado2').value;

  const limparTexto = texto => texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/[^\x00-\x7F]/g, '');

  let titulo = 'AULA';
  if (texto1) {
    const primeiraLinha = texto1.split('\n')[0].trim();
    if (primeiraLinha) titulo = `AULA DO DIA ${primeiraLinha}`;
  }

  if (titulo === 'AULA') {
    const dataValue = document.getElementById('data')?.value;
    if (dataValue) {
      const [ano, mes, dia] = dataValue.split('-');
      titulo = `AULA DO DIA ${dia}/${mes}/${ano}`;
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const x = (doc.internal.pageSize.width - doc.getTextWidth(titulo)) / 2;
  doc.text(titulo, x, 25);

  doc.setLineWidth(0.5);
  doc.line(15, 30, doc.internal.pageSize.width - 15, 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const textoFinal = limparTexto(`${texto1}\n\n${texto2}`);
  const linhas = doc.splitTextToSize(textoFinal, 180);
  doc.text(linhas, 15, 40);

  doc.save(`${nomeArquivo}.pdf`);
}
