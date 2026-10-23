import { HttpClient } from '@angular/common/http';
import { Subscription, timeout } from 'rxjs';
import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BotService } from 'src/app/services/bot.service';

interface Message {
  text: string | SafeHtml;
  sender: string;
}

interface BotResponse {
  response: string;
}

@Component({
  selector: 'app-ai-chatbot',
  templateUrl: './ai-chatbot.component.html',
  styleUrls: ['./ai-chatbot.component.css']
})
export class AiChatbotComponent {
  messages: Message[] = [];
  userInput: string = '';
  apiUrl: string = 'https://ai-chatbot-5qwd.onrender.com/converse';
  // apiUrl: string = 'http://127.0.0.1:8000/converse';
  isTyping = false;
  isVoiceEnabled: boolean = false;
  isChatOpen: boolean = false;
  isListening: boolean = false;
  recognition: any;
  private requestSubscription?: Subscription;
  private modalSubscription?: Subscription;
  private waitingTimer?: ReturnType<typeof setTimeout>;


  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private botService: BotService
  ) {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        this.userInput = finalTranscript || interimTranscript;

        if (finalTranscript) {
          this.isListening = false;
          this.sendMessage();
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        console.log('Voice input ended, mic turned off.');
      };
    }
    else {
      console.error('Speech recognition is not supported in this browser.');
    }
    this.modalSubscription = this.botService.botModalStatus$.subscribe(status => {
      this.isChatOpen = status;
    });
  }

  // Do not send an unsolicited request when a visitor opens the portfolio.
  // Chatbot requests are initiated only after a visitor submits a message.
  modelClose() {
    this.isChatOpen = false;
  }
  formatResponseToHTML(text: string): SafeHtml {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    const formatted = escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>(?:\n<li>.*<\/li>)*)/g, '<ul>$1</ul>')
      .replace(/(<li>.*<\/li>(?:\n<li>.*<\/li>)*)/g, '<ol>$1</ol>')
      .replace(/<\/li>\s*<li>/g, '</li><li>')
      .replace(/(?:\r?\n)+/g, '<br>')
      .replace(/<\/ul><br>/g, '</ul>')
      .replace(/<\/ol><br>/g, '</ol>');

    return this.sanitizer.sanitize(SecurityContext.HTML, formatted) || "";
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (this.isTyping || !text || text.length > 500) return;

    const payload = this.createPayload(text);
    this.messages.push({ text, sender: 'user' });
    this.userInput = '';
    this.getBotResponse(payload);
  }

  private createPayload(text: string) {
    return {
      user_text: text,
      user_id: '3',
      company_id: 1
    };
  }

  getBotResponse(payload: { user_text: string; user_id: string; company_id: number }): void {
    this.isTyping = true;
    this.waitingTimer = setTimeout(() => {
      if (this.isTyping) {
        this.messages.push({
          text: 'The chatbot is taking longer than usual to respond. Please wait a moment.',
          sender: 'bot'
        });
      }
    }, 10000);

    this.requestSubscription = this.http.post<BotResponse>(this.apiUrl, payload)
      .pipe(timeout({ first: 90000 }))
      .subscribe({
        next: (response) => {
          this.finishRequest();
          const safeResponse = this.formatResponseToHTML(
            response?.response || 'No response available.'
          );
          this.messages.push({ text: safeResponse, sender: 'bot' });
          if (this.isVoiceEnabled) this.speakLastMessage();
        },
        error: () => {
          this.finishRequest();
          this.messages.push({
            text: 'The chatbot could not respond right now. Please try again later.',
            sender: 'bot'
          });
        }
      });
  }

  private finishRequest(): void {
    if (this.waitingTimer !== undefined) {
      clearTimeout(this.waitingTimer);
      this.waitingTimer = undefined;
    }
    this.isTyping = false;
  }

  ngOnDestroy(): void {
    this.requestSubscription?.unsubscribe();
    this.modalSubscription?.unsubscribe();
    this.finishRequest();
    if (this.isListening && this.recognition) {
      this.recognition.stop();
    }
  }

  speakLastMessage(): void {
    const lastMessage = this.messages[this.messages.length - 1];
    if (lastMessage && lastMessage.sender === 'bot') {
      let plainText = typeof lastMessage.text === 'string'
        ? lastMessage.text
        : this.sanitizer.sanitize(1, lastMessage.text) || '';

      plainText = plainText.replace(/<[^>]+>/g, '');
      plainText = plainText.replace(/\n/g, ' ');
      plainText = plainText.replace(/\s+/g, ' ').trim();

      const speech = new SpeechSynthesisUtterance(plainText);
      speech.lang = 'en-US';
      speechSynthesis.speak(speech);
    }
  }


  toggleVoice(): void {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    if (this.isVoiceEnabled) {
      this.speakLastMessage();
    } else {
      speechSynthesis.cancel();
    }
  }

  toggleVoiceInput(): void {
    if (!this.isListening) {
      this.startVoiceInput();
    } else {
      this.stopVoiceInput();
    }
  }

  startVoiceInput(): void {
    if (this.recognition) {
      this.isListening = true;
      this.recognition.start();
    }
  }

  stopVoiceInput(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

}

