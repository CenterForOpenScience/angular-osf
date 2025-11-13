import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';

import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set status input correctly', () => {
    fixture.componentRef.setInput('status', RegistryStatus.Accepted);
    expect(component.status()).toBe(RegistryStatus.Accepted);
  });

  it('should get label for Accepted status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.Accepted);
    expect(component.label).toBe('shared.statuses.accepted');
  });

  it('should get label for Pending status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.Pending);
    expect(component.label).toBe('shared.statuses.pending');
  });

  it('should get label for Unapproved status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.Unapproved);
    expect(component.label).toBe('shared.statuses.unapproved');
  });

  it('should get label for Withdrawn status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.Withdrawn);
    expect(component.label).toBe('shared.statuses.withdrawn');
  });

  it('should get label for InProgress status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.InProgress);
    expect(component.label).toBe('shared.statuses.inProgress');
  });

  it('should get label for PendingModeration status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingModeration);
    expect(component.label).toBe('shared.statuses.pendingModeration');
  });

  it('should get label for PendingRegistrationApproval status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingRegistrationApproval);
    expect(component.label).toBe('shared.statuses.pendingRegistrationApproval');
  });

  it('should get label for PendingEmbargoApproval status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingEmbargoApproval);
    expect(component.label).toBe('shared.statuses.pendingEmbargoApproval');
  });

  it('should get label for Embargo status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.Embargo);
    expect(component.label).toBe('shared.statuses.embargo');
  });

  it('should get label for PendingEmbargoTerminationApproval status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingEmbargoTerminationApproval);
    expect(component.label).toBe('shared.statuses.pendingEmbargoTerminationApproval');
  });

  it('should get label for PendingWithdrawRequest status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingWithdrawRequest);
    expect(component.label).toBe('shared.statuses.pendingWithdrawRequest');
  });

  it('should get label for PendingWithdraw status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingWithdraw);
    expect(component.label).toBe('shared.statuses.pendingWithdraw');
  });

  it('should get label for UpdatePendingApproval status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.UpdatePendingApproval);
    expect(component.label).toBe('shared.statuses.updatePendingApproval');
  });

  it('should get label for None status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.None);
    expect(component.label).toBe('');
  });

  it('should get severity for Accepted status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.Accepted);
    expect(component.severity).toBe('success');
  });

  it('should get severity for Pending status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.Pending);
    expect(component.severity).toBe('info');
  });

  it('should get severity for Unapproved status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.Unapproved);
    expect(component.severity).toBe('danger');
  });

  it('should get severity for Withdrawn status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.Withdrawn);
    expect(component.severity).toBe('danger');
  });

  it('should get severity for InProgress status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.InProgress);
    expect(component.severity).toBe('info');
  });

  it('should get severity for PendingModeration status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingModeration);
    expect(component.severity).toBe('warn');
  });

  it('should get severity for PendingRegistrationApproval status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingRegistrationApproval);
    expect(component.severity).toBe('warn');
  });

  it('should get severity for PendingEmbargoApproval status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingEmbargoApproval);
    expect(component.severity).toBe('warn');
  });

  it('should get severity for Embargo status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.Embargo);
    expect(component.severity).toBe('info');
  });

  it('should get severity for PendingEmbargoTerminationApproval status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingEmbargoTerminationApproval);
    expect(component.severity).toBe('warn');
  });

  it('should get severity for PendingWithdrawRequest status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingWithdrawRequest);
    expect(component.severity).toBe('info');
  });

  it('should get severity for PendingWithdraw status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.PendingWithdraw);
    expect(component.severity).toBe('warn');
  });

  it('should get severity for UpdatePendingApproval status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.UpdatePendingApproval);
    expect(component.severity).toBe('warn');
  });

  it('should get severity for None status', () => {
    fixture.componentRef.setInput('status', RegistryStatus.None);
    expect(component.severity).toBe(null);
  });
});
