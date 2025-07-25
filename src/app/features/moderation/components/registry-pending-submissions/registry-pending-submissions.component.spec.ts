import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryPendingSubmissionsComponent } from './registry-pending-submissions.component';

describe('RegistryPendingSubmissionsComponent', () => {
  let component: RegistryPendingSubmissionsComponent;
  let fixture: ComponentFixture<RegistryPendingSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryPendingSubmissionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryPendingSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
