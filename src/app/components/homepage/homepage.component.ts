import { Component, HostListener } from '@angular/core';
import { BotService } from 'src/app/services/bot.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  isNavOpen: boolean = false;

  constructor(private botService: BotService) {
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }
  @HostListener('document:click', ['$event'])
  closeNavOnClickOutside(event: MouseEvent): void {
    if (!this.isNavOpen) return;
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.navbar')) this.closeNav();
  }

  @HostListener('document:keydown.escape')
  closeNavOnEscape(): void {
    this.closeNav();
  }
  modelClose() {
    this.botService.closeBotModule();
  }
  closeNav() {
    this.isNavOpen = false;
  }
  openBot() {
    this.botService.openBotModule();
  }
}
