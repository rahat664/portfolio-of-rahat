import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AiChatbotComponent } from './ai-chatbot.component';
import { BotService } from '../../services/bot.service';

describe('AiChatbotComponent', () => {
  let component: AiChatbotComponent;
  let fixture: ComponentFixture<AiChatbotComponent>;
  let http: HttpTestingController;
  let botService: BotService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      declarations: [AiChatbotComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AiChatbotComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    botService = TestBed.inject(BotService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    http.verify();
  });

  it('does not contact the backend on initial render', () => {
    expect(component).toBeTruthy();
    expect(component.chatConsent).toBeFalse();
    http.expectNone(component.apiUrl);
  });

  it('does not send a typed message without explicit opt-in', () => {
    component.userInput = 'Hello';
    component.sendMessage();
    expect(component.messages.length).toBe(0);
    http.expectNone(component.apiUrl);
  });

  it('only allows one in-flight opted-in message at a time', () => {
    component.setChatConsent(true);
    component.userInput = 'Hello';
    component.sendMessage();
    expect(component.isTyping).toBeTrue();

    component.userInput = 'Second message';
    component.sendMessage();

    const requests = http.match(component.apiUrl);
    expect(requests.length).toBe(1);
    expect(requests[0].request.body.user_text).toBe('Hello');
    requests[0].flush({ response: 'Hello there' });

    expect(component.isTyping).toBeFalse();
    expect(component.messages.filter(message => message.sender === 'user').length).toBe(1);
  });

  it('cancels an in-flight request and clears text when consent is revoked', () => {
    component.setChatConsent(true);
    component.userInput = 'Please explain Angular';
    component.sendMessage();
    const request = http.expectOne(component.apiUrl);
    expect(request.cancelled).toBeFalse();

    component.setChatConsent(false);

    expect(request.cancelled).toBeTrue();
    expect(component.chatConsent).toBeFalse();
    expect(component.isTyping).toBeFalse();
    expect(component.messages.length).toBe(0);
    expect(component.userInput).toBe('');
  });

  it('clears the conversation and revokes consent when closed', () => {
    botService.openBotModule();
    component.setChatConsent(true);
    component.userInput = 'Test';
    component.sendMessage();
    const request = http.expectOne(component.apiUrl);

    component.modelClose();

    expect(component.isChatOpen).toBeFalse();
    expect(request.cancelled).toBeTrue();
    expect(component.chatConsent).toBeFalse();
    expect(component.messages.length).toBe(0);
  });

  it('does not convert unsafe markdown URL protocols to clickable links', () => {
    const result = String(component.formatResponseToHTML(
      'Warning [click](javascript:alert(1)) and <img src=x onerror=alert(1)>'
    ));
    expect(result).not.toContain('<a href="javascript:');
    expect(result).not.toContain('<img');
  });
});
