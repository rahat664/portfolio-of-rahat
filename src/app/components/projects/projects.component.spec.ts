import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCardComponent } from '../../generic/project-card/project-card.component';
import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ProjectsComponent, ProjectCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders every featured project in the list', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-project-card');
    expect(cards.length).toBe(component.projects.length);
    expect(component.projects.length).toBeGreaterThan(0);
  });
});
