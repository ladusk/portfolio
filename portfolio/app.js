const STORAGE_KEY = 'canes_contact_messages';

// --- CONFIGURAÇÃO DO EMAILJS ---
const PUBLIC_KEY = 'XnNnDKYHqyt-44LbG'; 
const SERVICE_ID = 'service_nlmd7w5'; 
const TEMPLATE_ID = 'template_q2byxph'; 

// Inicializa o EmailJS
emailjs.init({ publicKey: PUBLIC_KEY });
// -------------------------------

// Injeta 20 mensagens de teste se o localStorage estiver vazio
function seedIfEmpty() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  const seed = Array.from({ length: 20 }, (_, i) => ({
    id: Date.now() + i,
    name: `Visitante Teste ${i + 1}`,
    email: `teste${i + 1}@exemplo.com`,
    message: `Mensagem de validação número ${i + 1}.`,
    date: new Date().toISOString()
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
}
seedIfEmpty();

function getMessages() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}
function saveMessages(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}
function addMessage(name, email, message) {
  const all = getMessages();
  all.push({ id: Date.now(), name, email, message, date: new Date().toISOString() });
  saveMessages(all);
}

// Envio do formulário (Salva localmente E envia o e-mail)
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  // 1. Salva no LocalStorage
  addMessage(name, email, message);
  
  // 2. Envia o e-mail com EmailJS (AQUI ESTAVA O ERRO, AGORA CORRIGIDO)
  emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target)
    .then(() => {
      alert('Mensagem salva e e-mail enviado com sucesso!');
      e.target.reset();
    })
    .catch((error) => {
      console.error('Erro ao enviar e-mail:', error);
      alert('Mensagem salva localmente, mas houve um erro ao enviar o e-mail.');
      e.target.reset();
    });
});

// Atalho oculto: Ctrl + Shift + A abre o admin
document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    window.location.href = 'admin.html';
  }
});

// Clicar no © também abre o admin
document.getElementById('admin-link').addEventListener('click', function () {
  window.location.href = 'admin.html';
});