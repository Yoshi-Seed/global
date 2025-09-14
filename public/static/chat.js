// Chat functionality
let conversationId = null;
let isLoading = false;

// DOM elements
const agreeTerms = document.getElementById('agreeTerms');
const disclaimer = document.getElementById('disclaimer');
const chatInterface = document.getElementById('chatInterface');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.querySelector('.typing-indicator');
const charCount = document.getElementById('charCount');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Terms agreement handler
    agreeTerms.addEventListener('change', (e) => {
        if (e.target.checked) {
            disclaimer.style.display = 'none';
            chatInterface.style.display = 'block';
            messageInput.focus();
        } else {
            disclaimer.style.display = 'block';
            chatInterface.style.display = 'none';
        }
    });

    // Character count
    messageInput.addEventListener('input', (e) => {
        charCount.textContent = e.target.value.length;
        sendButton.disabled = isLoading || e.target.value.trim().length === 0;
    });

    // Send on Enter
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Send button click
    sendButton.addEventListener('click', sendMessage);

    // Initialize first message
    setTimeout(() => {
        if (agreeTerms.checked) {
            addMessage('ai', 'こんにちは！私はFeasibility Bot Yoshiです。医療系マーケットリサーチのフィージビリティスタディに関する専門的なご相談にお答えします。\n\n研究計画の実現可能性評価、規制要件の確認、被験者募集戦略、予算・タイムライン策定など、どのような点でもお気軽にご質問ください。');
        }
    }, 500);
});

// Send message function
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message || isLoading) return;

    // Add user message
    addMessage('user', message);
    messageInput.value = '';
    charCount.textContent = '0';
    
    // Show typing indicator
    setLoading(true);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversationId: conversationId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'リクエストに失敗しました');
        }

        // Update conversation ID
        if (data.conversationId) {
            conversationId = data.conversationId;
        }

        // Add AI response
        addMessage('ai', data.response, data.filtered);

    } catch (error) {
        console.error('Chat error:', error);
        addMessage('ai', 'すみません、一時的にサービスが利用できません。しばらく経ってから再度お試しください。', false, true);
    } finally {
        setLoading(false);
    }
}

// Add message to chat
function addMessage(sender, content, filtered = false, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message mb-4 ${sender === 'user' ? 'text-right' : 'text-left'}`;

    const contentClass = sender === 'user' 
        ? 'inline-block bg-blue-600 text-white px-4 py-2 rounded-lg max-w-xs lg:max-w-md'
        : isError
        ? 'inline-block bg-red-100 text-red-800 px-4 py-2 rounded-lg max-w-xs lg:max-w-md border border-red-200'
        : filtered
        ? 'inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg max-w-xs lg:max-w-md border border-yellow-200'
        : 'inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs lg:max-w-md';

    const icon = sender === 'user' 
        ? '<i class="fas fa-user mr-2"></i>'
        : isError
        ? '<i class="fas fa-exclamation-triangle mr-2"></i>'
        : filtered
        ? '<i class="fas fa-shield-alt mr-2"></i>'
        : '<i class="fas fa-robot mr-2"></i>';

    messageDiv.innerHTML = `
        <div class="${contentClass}">
            ${sender === 'ai' ? icon : ''}
            <span>${formatMessage(content)}</span>
            ${sender === 'user' ? icon : ''}
        </div>
        <div class="text-xs text-gray-500 mt-1">
            ${new Date().toLocaleTimeString('ja-JP')}
        </div>
    `;

    // Clear initial message
    if (chatMessages.children.length === 1 && chatMessages.children[0].textContent.includes('チャットを開始')) {
        chatMessages.innerHTML = '';
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format message content
function formatMessage(content) {
    return content
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// Set loading state
function setLoading(loading) {
    isLoading = loading;
    sendButton.disabled = loading || messageInput.value.trim().length === 0;
    
    if (loading) {
        typingIndicator.classList.add('active');
        messageInput.disabled = true;
    } else {
        typingIndicator.classList.remove('active');
        messageInput.disabled = false;
        messageInput.focus();
    }
}

// Rate limit handler
let lastRequestTime = 0;
const RATE_LIMIT_MS = 6000; // 6 seconds between requests

function checkRateLimit() {
    const now = Date.now();
    if (now - lastRequestTime < RATE_LIMIT_MS) {
        const remaining = Math.ceil((RATE_LIMIT_MS - (now - lastRequestTime)) / 1000);
        addMessage('ai', `少し頻繁すぎます。${remaining}秒後に再度お試しください。`, false, true);
        return false;
    }
    lastRequestTime = now;
    return true;
}

// Auto-scroll on new messages
const observer = new MutationObserver(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

observer.observe(chatMessages, { childList: true });

// Clear conversation after 24 hours
setTimeout(() => {
    if (conversationId) {
        addMessage('ai', 'セキュリティのため、24時間が経過しました。新しい会話を開始してください。');
        conversationId = null;
    }
}, 24 * 60 * 60 * 1000);