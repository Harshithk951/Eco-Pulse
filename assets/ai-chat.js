/**
 * Eco-Pulse AI Assistant Widget
 * Implements a floating glassmorphic chat interface powered by Gemini API.
 */

class EcoPulseAssistant {
  constructor() {
    this.apiKey = localStorage.getItem('eco_pulse_gemini_key') || "";
    this.apiUrl = "";
    this.isOpen = false;
    this.isThinking = false;

    // We maintain an internal message array for API history
    this.messages = [];
    
    // Internal system instructions for persona
    this.systemInstruction = "You are the Eco-Pulse AI Assistant. You help users understand their carbon footprint, provide actionable sustainability tips, and act as an expert eco-guide. Be warm, optimistic, concise, and user-friendly. Do not break character. Use simple markdown like bolding or bullet points for readability.";

    // Append UI when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.injectUI());
    } else {
      this.injectUI();
    }
  }

  injectUI() {
    const container = document.createElement('div');
    container.id = 'ai-assistant-container';
    // Base setup
    container.innerHTML = `
      <div id="ai-fab-wrapper" class="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-[100] transition-transform duration-300 ai-float-anim">
        <!-- Leaf Shaped Floating Button -->
        <button id="ai-fab" class="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)] cursor-pointer outline-none hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white/20 dark:border-emerald-900/50"
                style="border-top-left-radius: 50%; border-top-right-radius: 50%; border-bottom-left-radius: 50%; border-bottom-right-radius: 4px;">
          <span class="material-symbols-outlined text-[32px]" style="font-variation-settings: 'FILL' 1;">eco</span>
        </button>
      </div>

      <!-- Chat Modal Modal -->
      <div id="ai-chat-modal" class="fixed bottom-40 md:bottom-28 right-4 md:right-8 w-[calc(100vw-32px)] md:w-[400px] h-[550px] max-h-[75vh] flex flex-col bg-white/80 dark:bg-emerald-950/90 backdrop-blur-2xl border border-emerald-100 dark:border-emerald-800 shadow-2xl rounded-3xl z-[90] transform scale-y-95 scale-x-95 opacity-0 pointer-events-none translate-y-4 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-right overflow-hidden">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center p-0.5 shadow-md">
                <div class="w-full h-full rounded-full border-2 border-white/50 flex items-center justify-center">
                    <span class="material-symbols-outlined text-white text-[20px]" style="font-variation-settings: 'FILL' 1;">nest_eco_leaf</span>
                </div>
            </div>
            <div>
              <h3 class="font-headline font-bold text-emerald-900 dark:text-emerald-50 text-base leading-tight">Eco-Pulse AI</h3>
              <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-widest flex items-center gap-1 group">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button id="ai-close-btn" class="text-emerald-900/40 hover:text-emerald-900 dark:text-emerald-50/40 dark:hover:text-emerald-50 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Chat Area -->
        <div id="ai-chat-body" class="flex-1 overflow-y-auto p-6 flex flex-col gap-4 font-body scroll-smooth">
          <!-- Initial Welcome Message -->
          <div class="flex items-start gap-3 w-[90%] fade-in-msg">
            <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex-shrink-0 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <span class="material-symbols-outlined text-[16px]">eco</span>
            </div>
            <div class="bg-white dark:bg-emerald-900/30 border border-emerald-50 dark:border-emerald-800/30 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed shadow-emerald-900/5">
              Hi there! 🌱 I'm your Eco-Pulse assistant. How can I help you breathe life into your data today?
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-white/50 dark:bg-black/20 border-t border-black/5 dark:border-white/5 backdrop-blur-md">
          <form id="ai-chat-form" class="relative flex items-end gap-2">
            <textarea id="ai-chat-input" rows="1" class="w-full bg-white dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl px-4 py-3 pr-12 text-sm text-emerald-950 dark:text-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-none max-h-32 placeholder:text-emerald-900/30 dark:placeholder:text-emerald-100/30 shadow-inner" placeholder="Ask me about reducing emissions..."></textarea>
            <button type="submit" id="ai-send-btn" class="absolute right-2 bottom-2 w-8 h-8 bg-emerald-500 text-white rounded-xl shadow-md hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
          <div class="text-center mt-2">
             <span class="text-[9px] text-emerald-900/30 dark:text-emerald-100/30 font-medium tracking-wide uppercase">Powered by Gemini AI</span>
          </div>
        </div>
      </div>

      <style>
        .fade-in-msg { animation: fadeInMsg 0.4s ease-out forwards; }
        @keyframes fadeInMsg {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ai-float-anim { animation: aiFloat 3s ease-in-out infinite; }
        @keyframes aiFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        /* Markdown generated lists styling */
        .ai-message-content ul { list-style-type: disc; margin-left: 1.25rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .ai-message-content ol { list-style-type: decimal; margin-left: 1.25rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .ai-message-content strong { font-weight: 700; color: #065f46; }
        .dark .ai-message-content strong { color: #a7f3d0; }
        .ai-message-content p { margin-bottom: 0.5rem; }
        .ai-message-content p:last-child { margin-bottom: 0; }
        .ai-message-content a { color: #10b981; text-decoration: underline; text-underline-offset: 2px; }
      </style>
    `;

    document.body.appendChild(container);

    // Cache DOM nodes
    this.wrapper = document.getElementById('ai-fab-wrapper');
    this.fab = document.getElementById('ai-fab');
    this.modal = document.getElementById('ai-chat-modal');
    this.closeBtn = document.getElementById('ai-close-btn');
    this.form = document.getElementById('ai-chat-form');
    this.input = document.getElementById('ai-chat-input');
    this.chatBody = document.getElementById('ai-chat-body');

    this.bindEvents();
  }

  bindEvents() {
    this.fab.addEventListener('click', () => this.toggleModal());
    this.closeBtn.addEventListener('click', () => this.toggleModal());
    
    // Auto resize textarea
    this.input.addEventListener('input', () => {
      this.input.style.height = 'auto';
      this.input.style.height = (this.input.scrollHeight) + 'px';
    });

    // Enter to submit
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  toggleModal() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      if (!this.apiKey) {
        const key = prompt("Please enter your Gemini API Key to use the Eco-Pulse Assistant:\\n(This is safely stored in your browser's local storage and never leaves your device.)");
        if (key && key.trim()) {
           this.apiKey = key.trim();
           localStorage.setItem('eco_pulse_gemini_key', this.apiKey);
        } else {
           this.isOpen = false;
           return;
        }
      }
      this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${this.apiKey}`;
      this.modal.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4', 'scale-y-95', 'scale-x-95');
      this.modal.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0', 'scale-100');
      this.wrapper.classList.remove('ai-float-anim');
      this.fab.classList.add('rotate-12', 'scale-90'); // Slight reaction
      setTimeout(() => this.input.focus(), 300);
    } else {
      this.modal.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4', 'scale-y-95', 'scale-x-95');
      this.modal.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0', 'scale-100');
      this.wrapper.classList.add('ai-float-anim');
      this.fab.classList.remove('rotate-12', 'scale-90');
    }
  }

  async handleSubmit() {
    const text = this.input.value.trim();
    if (!text || this.isThinking) return;

    // Reset input
    this.input.value = '';
    this.input.style.height = 'auto';

    this.appendUserMessage(text);
    
    // Add to API history format
    this.messages.push({
      role: "user",
      parts: [{ text }]
    });

    await this.fetchGeminiResponse();
  }

  appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'flex items-start gap-3 w-[90%] self-end flex-row-reverse fade-in-msg';
    div.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-md">
          U
      </div>
      <div class="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-2xl rounded-tr-sm px-4 py-3 shadow-md text-sm text-white leading-relaxed text-right">
        ${this.escapeHTML(text)}
      </div>
    `;
    this.chatBody.appendChild(div);
    this.scrollToBottom();
  }

  appendBotMessage(htmlContent) {
    const div = document.createElement('div');
    div.className = 'flex items-start gap-3 w-[95%] fade-in-msg ai-msg-container';
    div.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex-shrink-0 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <span class="material-symbols-outlined text-[16px]">eco</span>
      </div>
      <div class="bg-white dark:bg-emerald-900/30 border border-emerald-50 dark:border-emerald-800/30 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed shadow-emerald-900/5 ai-message-content">
        ${htmlContent}
      </div>
    `;
    this.chatBody.appendChild(div);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const div = document.createElement('div');
    div.id = 'ai-typing-indicator';
    div.className = 'flex items-start gap-3 w-[90%] fade-in-msg';
    div.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex-shrink-0 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <span class="material-symbols-outlined text-[16px]">eco</span>
      </div>
      <div class="bg-white dark:bg-emerald-900/30 border border-emerald-50 dark:border-emerald-800/30 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 h-[46px]">
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style="animation-delay: 0s;"></div>
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style="animation-delay: 0.15s;"></div>
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style="animation-delay: 0.3s;"></div>
      </div>
    `;
    this.chatBody.appendChild(div);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const typing = document.getElementById('ai-typing-indicator');
    if (typing) typing.remove();
  }

  scrollToBottom() {
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Ultra-simple markdown parser for boldness and lists
  parseSimpleMarkdown(text) {
    let parsed = this.escapeHTML(text);
    // Bolding
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Line breaks to BR
    parsed = parsed.replace(/\n\n/g, '</p><p>');
    parsed = parsed.replace(/\n/g, '<br/>');

    // Bullet points (quick hack)
    parsed = parsed.replace(/<br\/>\*/g, '<br/>&bull;');
    parsed = parsed.replace(/^\* /gm, '&bull; ');

    return `<p>${parsed}</p>`;
  }

  async fetchGeminiResponse() {
    this.isThinking = true;
    this.showTypingIndicator();

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
             parts: [{ text: this.systemInstruction }]
          },
          contents: this.messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      const data = await response.json();
      
      this.removeTypingIndicator();
      
      if (data.error) {
          throw new Error(data.error.message || "API Error");
      }

      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (botText) {
        // We push the response to history
        this.messages.push({
          role: "model",
          parts: [{ text: botText }]
        });
        
        const formattedResp = this.parseSimpleMarkdown(botText);
        this.appendBotMessage(formattedResp);
      } else {
        this.appendBotMessage("<em class='text-error'>I encountered an unexpected response format.</em>");
      }

    } catch (err) {
      console.error("Gemini API Error:", err);
      this.removeTypingIndicator();
      this.appendBotMessage(`<em class='text-red-500'>Oops! Something went wrong (${err.message}). Make sure your API key is valid.</em>`);
      // Remove last user message from memory if api failed
      this.messages.pop();
    } finally {
      this.isThinking = false;
    }
  }
}

// Innitialize widget
window.ecoPulseAssistant = new EcoPulseAssistant();
