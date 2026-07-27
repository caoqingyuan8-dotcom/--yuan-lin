/* 园林博士 - AI 园林问答助手 */
(function() {
  const API_URL = 'http://172.24.82.175:8767/api/chat';
  
  // 卡通头像 SVG - 鲜艳小园丁（带动画 class）
  const BOT_AVATAR_SVG = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="bot-avatar-svg">
    <circle cx="24" cy="24" r="22" fill="#c8f0d0" stroke="#4caf50" stroke-width="1.5"/>
    <!-- 草帽 -->
    <ellipse cx="24" cy="12" rx="15" ry="3.5" fill="#ffcc80"/>
    <path d="M14 12 Q14 5 24 4 Q34 5 34 12" fill="#ffb74d"/>
    <rect x="18" y="3" rx="2" ry="2" width="12" height="3.5" fill="#ffa726"/>
    <!-- 帽带 -->
    <path d="M13 12 Q9 18 11 23" fill="none" stroke="#ff8a65" stroke-width="1.2" stroke-linecap="round"/>
    <!-- 花朵装饰 -->
    <circle cx="34" cy="10" r="3.5" fill="#ff4081" class="flower-spin"/>
    <circle cx="34" cy="10" r="1.5" fill="#ffeb3b"/>
    <!-- 脸 -->
    <circle cx="24" cy="24" r="12" fill="#fff"/>
    <!-- 眼睛 - 大而有神 -->
    <ellipse cx="19" cy="22" rx="3.5" ry="4" fill="#2e2e2e"/>
    <ellipse cx="29" cy="22" rx="3.5" ry="4" fill="#2e2e2e"/>
    <ellipse cx="20.5" cy="20" rx="1.5" ry="1.8" fill="#fff" class="eye-sparkle"/>
    <ellipse cx="30.5" cy="20" rx="1.5" ry="1.8" fill="#fff" class="eye-sparkle"/>
    <!-- 高光 -->
    <circle cx="18" cy="20" r=".6" fill="#fff" opacity=".8"/>
    <circle cx="28" cy="20" r=".6" fill="#fff" opacity=".8"/>
    <!-- 腮红 -->
    <ellipse cx="15" cy="27" rx="3.5" ry="2.5" fill="#ff80ab" opacity=".5"/>
    <ellipse cx="33" cy="27" rx="3.5" ry="2.5" fill="#ff80ab" opacity=".5"/>
    <!-- 笑容 -->
    <path d="M20 29 Q24 34 28 29" fill="none" stroke="#2e2e2e" stroke-width="1.5" stroke-linecap="round"/>
    <!-- 小手 -->
    <path d="M13 25c-1.5 1.5-1.5 4 0 5" fill="none" stroke="#66bb6a" stroke-width="1.5" stroke-linecap="round" class="hand-wave"/>
    <path d="M35 25c1.5 1.5 1.5 4 0 5" fill="none" stroke="#66bb6a" stroke-width="1.5" stroke-linecap="round" class="hand-wave"/>
  </svg>`;

  const USER_AVATAR_SVG = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#2e7d32"/>
    <circle cx="24" cy="17" r="8" fill="#fff" opacity=".9"/>
    <path d="M12 38 Q24 30 36 38" fill="none" stroke="#fff" stroke-width="3" opacity=".9" stroke-linecap="round"/>
    <circle cx="19" cy="16" r="2" fill="#2e7d32" opacity=".4"/>
    <circle cx="29" cy="16" r="2" fill="#2e7d32" opacity=".4"/>
    <path d="M21 20 Q24 23 27 20" fill="none" stroke="#2e7d32" stroke-width="1.5" opacity=".4" stroke-linecap="round"/>
  </svg>`;

  // 初始问候语
  const GREETING = '你好！我是园林博士🌱，欢迎来到园林全景。关于园林、园艺、植物养护的问题，尽管问我！';

  // 创建 DOM
  function createWidget() {
    // Bubble
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.id = 'garden-chat-bubble';
    bubble.innerHTML = `<div class="avatar-svg">${BOT_AVATAR_SVG}</div>`;
    document.body.appendChild(bubble);

    // Panel
    const panel = document.createElement('div');
    panel.className = 'chat-panel';
    panel.id = 'garden-chat-panel';
    panel.innerHTML = `
      <div class="chat-header">
        <div class="avatar-svg">${BOT_AVATAR_SVG}</div>
        园林博士
        <span class="close-btn" id="garden-chat-close">✕</span>
      </div>
      <div class="chat-messages" id="garden-chat-msgs">
        <div class="chat-msg bot">
          <div class="avatar">${BOT_AVATAR_SVG}</div>
          <div class="bubble">${GREETING}</div>
        </div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="garden-chat-input" placeholder="问问园林博士…" autocomplete="off">
        <button id="garden-chat-send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(panel);

    // 绑定事件
    const input = document.getElementById('garden-chat-input');
    const sendBtn = document.getElementById('garden-chat-send');
    const msgs = document.getElementById('garden-chat-msgs');

    bubble.onclick = function() {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) {
        setTimeout(() => input.focus(), 300);
        msgs.scrollTop = msgs.scrollHeight;
      }
    };

    document.getElementById('garden-chat-close').onclick = function() {
      panel.classList.remove('open');
    };

    function addMessage(text, isUser) {
      const div = document.createElement('div');
      div.className = 'chat-msg ' + (isUser ? 'user' : 'bot');
      const avatarSvg = isUser ? USER_AVATAR_SVG : BOT_AVATAR_SVG;
      div.innerHTML = `<div class="avatar">${avatarSvg}</div><div class="bubble">${text}</div>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function showTyping() {
      const div = document.createElement('div');
      div.className = 'chat-msg bot';
      div.id = 'garden-chat-typing';
      div.innerHTML = `<div class="avatar">${BOT_AVATAR_SVG}</div><div class="bubble chat-typing"><span></span><span></span><span></span></div>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function hideTyping() {
      const el = document.getElementById('garden-chat-typing');
      if (el) el.remove();
    }

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      
      input.value = '';
      sendBtn.disabled = true;
      addMessage(text, true);
      showTyping();

      try {
        const resp = await fetch(API_URL, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({message: text})
        });
        const data = await resp.json();
        hideTyping();
        addMessage(data.reply || '抱歉，我没能理解你的问题。', false);
      } catch(e) {
        hideTyping();
        addMessage('⚠️ 服务暂时不可用，请稍后再试。', false);
      } finally {
        sendBtn.disabled = false;
        input.focus();
      }
    }

    sendBtn.onclick = sendMessage;
    input.onkeydown = function(e) {
      if (e.key === 'Enter') sendMessage();
    };
  }

  // 页面加载后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
