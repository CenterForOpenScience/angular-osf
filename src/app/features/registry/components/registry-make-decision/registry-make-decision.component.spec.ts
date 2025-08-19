import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryMakeDecisionComponent } from './registry-make-decision.component';

describe.skip('RegistryMakeDecisionComponent', () => {
  let component: RegistryMakeDecisionComponent;
  let fixture: ComponentFixture<RegistryMakeDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryMakeDecisionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
