import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortRegistrationInfoComponent } from './short-registration-info.component';

describe.skip('ShortRegistrationInfoComponent', () => {
  let component: ShortRegistrationInfoComponent;
  let fixture: ComponentFixture<ShortRegistrationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortRegistrationInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShortRegistrationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
