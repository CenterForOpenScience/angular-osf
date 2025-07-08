import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryStatusesComponent } from './registry-statuses.component';

describe('RegistryStatusesComponent', () => {
  let component: RegistryStatusesComponent;
  let fixture: ComponentFixture<RegistryStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryStatusesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
