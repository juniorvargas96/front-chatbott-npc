// script.js (versão final corrigida)
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

    // --- BOTÃO FLUTUANTE → abre só a primeira tela
    floatButton.addEventListener('click', () => {
        mainWindow.classList.add('visible');
        floatButton.style.display = 'none';
    });

    function closeChat() {
        mainWindow.classList.remove('visible');
        floatButton.style.display = 'flex';
        welcomeScreen.classList.remove('hidden');
        chatScreen.classList.add('hidden');

        // limpa qualquer mensagem antiga
        messagesArea.innerHTML = "";
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

    // --- 🔥 QUANDO CLICAR EM “Pergunte ao chat” → MOSTRA AS MENSAGENS AUTOMÁTICAS ---
    startChatButton.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');

        // limpa mensagens antigas sempre que abrir um novo chat
        messagesArea.innerHTML = "";

        sendWelcomeSequence();  // ⬅⬅⬅ mensagem automática do bot aqui!
    });

    // --- COMUNICAÇÃO COM A API ---
    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const pergunta = chatInput.value.trim();
        if (!pergunta) return;

        addMessage(pergunta, 'user');
        chatInput.value = '';

        const typingBubble = showTypingAnimation();

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: pergunta })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const delay = Math.min(2000 + data.resposta.length * 15, 6000);

            setTimeout(() => {
                typingBubble.remove();
                addMessage(data.resposta, 'bot');
            }, delay);

        } catch (error) {
            console.error('Falha ao comunicar com a API:', error);

            typingBubble.remove();
            addMessage('Desculpe, estou com problemas de conexão. Tente novamente.', 'bot');
        }
    });

    // --- FUNÇÃO PARA ADICIONAR MENSAGENS ---
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} fade-in`;

        let htmlText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        htmlText = htmlText.replace(/\*(.*?)\*/g, '<em>$1</em>');

        messageDiv.innerHTML = htmlText;

        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // --- ANIMAÇÃO "digitando..." ---
    function showTypingAnimation() {
        const bubble = document.createElement('div');
        bubble.className = 'message bot bot-loading fade-in';
        bubble.innerHTML = `
            <span class="typing-dots">
                <span></span><span></span><span></span>
            </span>
        `;
        messagesArea.appendChild(bubble);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        return bubble;
    }

    // --- SEQUÊNCIA AUTOMÁTICA DAS MENSAGENS DO BOT ---
    function sendWelcomeSequence() {
        setTimeout(() => {
            addMessage('Olá! Sou o NPC-Chatbot, assistente virtual do Jovem Programador.', 'bot');

            const typing = showTypingAnimation();

            setTimeout(() => {
                typing.remove();
                addMessage('Em que posso te ajudar hoje?', 'bot');
            }, 1300);

        }, 300);
    }
});
