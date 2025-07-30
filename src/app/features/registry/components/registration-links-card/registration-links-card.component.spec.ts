import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationLinksCardComponent } from './registration-links-card.component';

describe('RegistrationLinksCardComponent', () => {
  let component: RegistrationLinksCardComponent;
  let fixture: ComponentFixture<RegistrationLinksCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationLinksCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationLinksCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
