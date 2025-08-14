import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeDecisionComponent } from './make-decision.component';

describe.skip('MakeDecisionComponent', () => {
  let component: MakeDecisionComponent;
  let fixture: ComponentFixture<MakeDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeDecisionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
