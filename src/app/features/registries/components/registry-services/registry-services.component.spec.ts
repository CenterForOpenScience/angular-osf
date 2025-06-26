import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryServicesComponent } from './registry-services.component';

describe('RegistryServicesComponent', () => {
  let component: RegistryServicesComponent;
  let fixture: ComponentFixture<RegistryServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryServicesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
