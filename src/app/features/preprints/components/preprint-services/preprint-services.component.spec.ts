import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintServicesComponent } from './preprint-services.component';

describe('PreprintServicesComponent', () => {
  let component: PreprintServicesComponent;
  let fixture: ComponentFixture<PreprintServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintServicesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
