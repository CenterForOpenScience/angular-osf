import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  function setup(status: RegistryStatus): void {
    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
      providers: [provideOSFCore()],
    });
  });

  it('should create', () => {
    setup(RegistryStatus.Accepted);

    expect(component).toBeTruthy();
  });

  it('should map accepted status to label and severity', () => {
    setup(RegistryStatus.Accepted);

    expect(component.label()).toBe('shared.statuses.accepted');
    expect(component.severity()).toBe('success');
  });

  it('should map rejected status to label and severity', () => {
    setup(RegistryStatus.Rejected);

    expect(component.label()).toBe('shared.statuses.rejected');
    expect(component.severity()).toBe('danger');
  });

  it('should not render tag when status label is empty', () => {
    setup(RegistryStatus.None);

    const tag = fixture.nativeElement.querySelector('p-tag');

    expect(component.label()).toBe('');
    expect(component.severity()).toBe(null);
    expect(tag).toBeNull();
  });

  it('should use fallback values for unknown status', () => {
    setup('unknown-status' as RegistryStatus);

    expect(component.label()).toBe('resourceCard.type.null');
    expect(component.severity()).toBe(null);
  });
});
