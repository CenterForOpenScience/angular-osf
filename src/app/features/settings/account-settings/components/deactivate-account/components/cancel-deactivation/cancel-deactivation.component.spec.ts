import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelDeactivationComponent } from './cancel-deactivation.component';

describe('CancelDeactivationComponent', () => {
  let component: CancelDeactivationComponent;
  let fixture: ComponentFixture<CancelDeactivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelDeactivationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelDeactivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
