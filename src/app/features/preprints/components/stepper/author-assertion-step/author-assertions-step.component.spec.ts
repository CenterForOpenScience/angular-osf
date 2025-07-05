import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorAssertionsStepComponent } from './author-assertions-step.component';

describe('AuthorAssertionsComponent', () => {
  let component: AuthorAssertionsStepComponent;
  let fixture: ComponentFixture<AuthorAssertionsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorAssertionsStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorAssertionsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
