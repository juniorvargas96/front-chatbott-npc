// script.js (versão final)
document.addEventListener('DOMContentLoaded', function() {
    // --- ELEMENTOS DA NAVEGAÇÃO ---
    const floatButton = document.getElementById('float-button');
    const mainWindow = document.getElementById('main-window');
    const welcomeScreen = document.getElementById('welcome-screen');
    const chatScreen = document.getElementById('chat-screen');
    const startChatButton = document.getElementById('start-chat-button');
    const backButtons = document.querySelectorAll('.back-button');

    // --- ELEMENTOS DO CHAT ---
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const messagesArea = document.getElementById('messages-area');

    // 🔥 URL de produção no Render
    const apiUrl = 'https://chatbot-front-e-back-main-1.onrender.com/chat/';

    // --- LÓGICA DE NAVEGAÇÃO ENTRE TELAS ---
    floatButton.addEventListener('click', () => {
        mainWindow.classList.add('visible');
        floatButton.style.display = 'none';
    });

    function closeChat() {
        mainWindow.classList.remove('visible');
        floatButton.style.display = 'flex';
        welcomeScreen.classList.remove('hidden');
        chatScreen.classList.add('hidden');
    }

    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!chatScreen.classList.contains('hidden')) {
                chatScreen.classList.add('hidden');
                welcomeScreen.classList.remove('hidden');
            } else {
                closeChat();
            }
        });
    });

    startChatButton.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
    });

    // --- COMUNICAÇÃO COM A API ---
    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const pergunta = chatInput.value.trim();
        if (!pergunta) return;

        addMessage(pergunta, 'user');
        chatInput.value = '';

        try {
            addMessage('Digitando...', 'bot-loading');

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: pergunta })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            removeLoadingMessage();
            addMessage(data.resposta, 'bot');

        } catch (error) {
            console.error('Falha ao comunicar com a API:', error);
            removeLoadingMessage();
            addMessage('Desculpe, estou com problemas de conexão. Tente novamente.', 'bot');
        }
    });

    // Função para adicionar novas mensagens (com Markdown)
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        let htmlText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        htmlText = htmlText.replace(/\*(.*?)\*/g, '<em>$1</em>');

        messageDiv.innerHTML = htmlText;

        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
    
    // Remover "Digitando..."
    function removeLoadingMessage() {
        const loadingMessage = document.querySelector('.bot-loading');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }
});
