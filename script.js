// === Chatbot Script (No Google Sheet logging, no typing) ===

// 1) DOM references
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const micBtn   = document.getElementById('mic-btn');
const sendBtn  = document.getElementById('send-btn');

// 2) Dialogue stage counter
let stage = 0;   // 0: first question, 1: recommend, ...

// ---------- helper: chat bubble ----------
function createMsg(text, sender){
  const wrap   = document.createElement('div');
  wrap.className = 'msg-wrapper ' + sender;

  const avatar = document.createElement('div');
  avatar.className = 'avatar ' + sender;

  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + sender;
  bubble.innerHTML = text.replace(/\n/g,'<br>');

  if(sender === 'bot'){
    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
  }else{
    wrap.appendChild(bubble);
    wrap.appendChild(avatar);
  }
  chatLog.appendChild(wrap);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// ---------- Init ----------
window.onload = ()=>{
  createMsg('我是您的智能客服，很高兴为您服务。这里有什么可以帮到您的？例如，您可以输入“推荐一款台灯。','bot');

  // disable manual typing
  userInput.readOnly = true;
  userInput.addEventListener('keydown',e=>e.preventDefault());
};

// ---------- Speech Recognition ----------
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if(recognition){
  recognition.lang = 'zh-CN';
  recognition.continuous = false;
}

micBtn.onclick = ()=>{
  if(!recognition){
    alert('当前浏览器不支持语音识别'); return;
  }
  recognition.start();
  micBtn.textContent = '⏺';
};

if(recognition){
  recognition.onresult = (e)=>{
    const transcript = e.results[0][0].transcript;
    userInput.value = transcript;
    micBtn.textContent = '🎤';
  };
  recognition.onerror = ()=>{ micBtn.textContent = '🎤'; };
}

// ---------- Bot response ----------
function botRespond(){
  if(stage === 0){
    createMsg('您好，可以了解一下您对台灯的需求吗？比如：<br>- 使用场景？<br>- 亮度要求？<br>- 是否偏好极简/可爱/复古等外观风格？<br>告诉我您的偏好，我来为您推荐合适的台灯哦！','bot');
  }else if(stage === 1){
    createMsg('亲，感谢您的反馈～很抱歉，我没能理解您的需求。期待下次能更好地为您服务！','bot');

    setTimeout(()=>{
      createMsg('🎉 感谢您的反馈，本轮对话已结束，请返回问卷继续作答。','bot');
    },1000);
  }
  stage++;
}

// ---------- send message ----------
function sendMessage(){
  const text = userInput.value.trim();
  if(!text) return;

  createMsg(text,'user');
  userInput.value = '';

  setTimeout(botRespond, 1000);
}

sendBtn.onclick = sendMessage;
userInput.onkeypress = e=>{
  if(e.key==='Enter'){ sendMessage(); }
};

