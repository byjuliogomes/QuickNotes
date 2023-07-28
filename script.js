// Função para salvar a nota no localStorage
function saveNote() {
    const noteText = document.getElementById("note-text").value.trim();
    if (noteText !== "") {
      const timestamp = new Date().getTime();
      const noteDate = formatDate(new Date());
      const note = {
        timestamp: timestamp,
        text: noteText,
        date: noteDate,
      };
      notes.push(note);
      localStorage.setItem("notes", JSON.stringify(notes));
      document.getElementById("note-text").value = "";
      displayNotes();
    }
  }
  
  function deleteNote(noteId) {
    notes = notes.filter((note) => note.timestamp !== noteId);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();
  }
  
  function formatDate(date) {
    const options = { weekday: "short", day: "numeric", month: "numeric" };
    return date.toLocaleDateString("pt-BR", options);
  }
  
  function toggleCheckbox(noteId) {
    const noteElement = document.getElementById(`note-${noteId}`);
    const checkboxes = noteElement.getElementsByClassName("checkbox");
    const checkboxElement = checkboxes[0]; // Assumimos que há apenas um checkbox por nota
    
    if (checkboxElement.classList.contains("checked")) {
      checkboxElement.innerHTML = "□"; // Checkbox não marcado
      noteElement.classList.remove("completed");
    } else {
      checkboxElement.innerHTML = "■"; // Checkbox marcado
      noteElement.classList.add("completed");
    }
  
    checkboxElement.classList.toggle("checked"); // Adiciona ou remove a classe 'checked'
  
    updateNoteText(noteId); // Atualiza o texto da nota no localStorage
  }
  
  function updateNoteText(noteId) {
    const noteElement = document.getElementById(`note-${noteId}`);
    const checkboxElement = noteElement.querySelector(".checkbox");
    const noteText = noteElement.innerText.trim();
  
    // Remove o texto do checkbox marcado antes de salvar a nota no localStorage
    const noteData = {
      timestamp: noteId,
      text: checkboxElement.classList.contains("checked") ? `/${noteText}` : noteText,
      date: formatDate(new Date()),
      completed: checkboxElement.classList.contains("checked"),
    };
  
    const noteIndex = notes.findIndex((note) => note.timestamp === noteId);
    if (noteIndex !== -1) {
      notes[noteIndex] = noteData;
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }
  
  function toggleDateNotes(date) {
    const dateHeader = document.getElementById(`date-${date}`);
    const notesList = dateHeader.nextElementSibling;
  
    notesList.classList.toggle("hidden");
  }
  
  function displayNotes() {
    notesList.innerHTML = "";
    notes.sort((a, b) => a.timestamp - b.timestamp); // Ordena as notas por data de criação
    let currentNoteDate = "";
    notes.forEach((note) => {
      const noteDate = note.date;
      let noteText = note.text;
  
      // Verifica se a nota começa com a barra ("/") para exibir o checkbox
      const showCheckbox = noteText.startsWith("/");
      if (showCheckbox) {
        noteText = noteText.replace(/^\//, ""); // Remove a barra do texto da nota
      }
  
      // Aplica formatação do texto usando expressões regulares
      noteText = noteText
        .replace(/\*(.*?)\*/g, "<b>$1</b>") // negrito
        .replace(/_(.*?)_/g, "<i>$1</i>") // itálico
        .replace(/~(.*?)~/g, "<del>$1</del>") // tachado
        .replace(/\*_(.*?)_\*/g, "<b><i>$1</i></b>") // negrito e itálico
        .replace(/```(.*?)```/g, "<code>$1</code>"); // monoespaçado
  
      if (noteDate !== currentNoteDate) {
        const noteDateHeader = document.createElement("h3");
        noteDateHeader.textContent = noteDate;
        notesList.appendChild(noteDateHeader);
        currentNoteDate = noteDate;
      }
  
      const noteElement = document.createElement("div");
      noteElement.id = `note-${note.timestamp}`;
      noteElement.classList.add("note");
      if (note.completed) {
        noteElement.classList.add("completed");
        noteText = `<del>${noteText}</del>`;
      }
  
      if (showCheckbox) {
        noteElement.innerHTML = `<span class="checkbox" onclick="toggleCheckbox(${note.timestamp})">□</span>${noteText}`;
      } else {
        noteElement.innerHTML = noteText;
      }
  
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteButton.classList.add("delete-btn");
      deleteButton.addEventListener("click", () => deleteNote(note.timestamp));
  
      noteElement.appendChild(deleteButton);
      notesList.appendChild(noteElement);
    });
  }
  
  document.getElementById("save-btn").addEventListener("click", saveNote);
  
  // Exibe as notas salvas assim que a página é carregada
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  const notesList = document.getElementById("notes-list");
  displayNotes();
  
  // Função para aplicar formatação no texto
  function formatText(style) {
    const noteText = document.getElementById("note-text");
    const selectionStart = noteText.selectionStart;
    const selectionEnd = noteText.selectionEnd;
  
    const textBeforeSelection = noteText.value.substring(0, selectionStart);
    const selectedText = noteText.value.substring(selectionStart, selectionEnd);
    const textAfterSelection = noteText.value.substring(selectionEnd);
  
    let formattedText = selectedText;
  
    if (style === "bold") {
      formattedText = `*${selectedText}*`;
    } else if (style === "italic") {
      formattedText = `_${selectedText}_`;
    } else if (style === "underline") {
      formattedText = `~${selectedText}~`;
    } else if (style === "strikethrough") {
      formattedText = `*_${selectedText}_*`;
    }
  
    noteText.value = textBeforeSelection + formattedText + textAfterSelection;
    noteText.focus();
  
    // Posiciona o cursor após o texto formatado
    noteText.setSelectionRange(
      selectionStart + 1,
      selectionStart + formattedText.length - 1
    );
  }
  
  // Função para inserir emojis no texto
  function insertEmoji(emoji) {
    const noteText = document.getElementById("note-text");
    noteText.focus();
    noteText.setRangeText(emoji, noteText.selectionStart, noteText.selectionEnd, 'end');
  }
  
 // Função para atualizar o tema
function updateTheme() {
    const selectedTheme = document.getElementById("theme-select").value;
    const body = document.body;
    if (selectedTheme === "dark") {
      body.classList.add("dark-theme");
    } else {
      body.classList.remove("dark-theme");
    }
  
    displayNotes(); // Chama a função para exibir as notas novamente após a mudança de tema
  }
  
  // Chama a função de atualização de tema quando a página é carregada
  updateTheme();
  
  // Escuta a mudança de tema pelo usuário e atualiza o tema
  document.getElementById("theme-select").addEventListener("change", updateTheme);
  