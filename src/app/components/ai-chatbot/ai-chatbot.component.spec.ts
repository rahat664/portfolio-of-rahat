import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AiChatbotComponent } from './ai-chatbot.component';

describe('AiChatbotComponent', () => {
  let component: AiChatbotComponent;
  let fixture: ComponentFixture<AiChatbotComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      declarations: [AiChatbotComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AiChatbotComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    http.verify();
  });

  it('should create without automatically sending messages', () => {
    expect(component).toBeTruthy();
    http.expectNone(component.apiUrl);
  });

  it('allows only one in-flight message at a time', () => {
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
});
