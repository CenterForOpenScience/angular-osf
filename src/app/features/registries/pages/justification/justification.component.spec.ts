import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationComponent } from './justification.component';

describe('JustificationComponent', () => {
  let component: JustificationComponent;
  let fixture: ComponentFixture<JustificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JustificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
