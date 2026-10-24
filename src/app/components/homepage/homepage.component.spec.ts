import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    // Test the homepage shell in isolation; feature components have their own tests.
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomepageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens and closes mobile navigation', () => {
    component.toggleNav();
    expect(component.isNavOpen).toBeTrue();
    component.closeNavOnEscape();
    expect(component.isNavOpen).toBeFalse();
  });

  it('offers an accessible native resume download link', () => {
    const link = fixture.nativeElement.querySelector('a[download]') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('Resume-of-Rahat-Kabir-latests.pdf');
    expect(link.getAttribute('aria-label')).toContain('resume');
  });
});
