import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedServicesComponent } from './linked-services.component';

describe.skip('LinkedServicesComponent', () => {
  let component: LinkedServicesComponent;
  let fixture: ComponentFixture<LinkedServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedServicesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
