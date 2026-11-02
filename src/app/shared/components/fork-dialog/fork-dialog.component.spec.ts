import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { ForkDialogComponent } from './fork-dialog.component';

interface SetupOverrides {
  resourceType?: CurrentResourceType;
}

describe('ForkDialogComponent', () => {
  let component: ForkDialogComponent;
  let fixture: ComponentFixture<ForkDialogComponent>;
  let dialogRef: DynamicDialogRef;

  function setup(overrides: SetupOverrides = {}) {
    TestBed.configureTestingModule({
      imports: [ForkDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, {
          data: { resourceType: overrides.resourceType ?? CurrentResourceType.Projects },
        }),
      ],
    });

    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(ForkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should show the project message', () => {
    setup();

    expect(component.messageKey).toBe('project.overview.dialog.fork.messageProject');
    expect(fixture.nativeElement.textContent).toContain('project.overview.dialog.fork.messageProject');
  });

  it('should show the registration message', () => {
    setup({ resourceType: CurrentResourceType.Registrations });

    expect(component.messageKey).toBe('project.overview.dialog.fork.messageRegistration');
    expect(fixture.nativeElement.textContent).toContain('project.overview.dialog.fork.messageRegistration');
  });

  it('should close with false when cancel is clicked', () => {
    setup();

    const [cancelButton] = fixture.nativeElement.querySelectorAll('button');
    cancelButton.click();

    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close with true when confirm is clicked', () => {
    setup();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();

    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
