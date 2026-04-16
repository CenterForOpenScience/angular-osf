import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ProjectOverviewModel } from '../../models';
import { DuplicateProject, ProjectOverviewSelectors } from '../../store';

import { DuplicateDialogComponent } from './duplicate-dialog.component';

describe('DuplicateDialogComponent', () => {
  let component: DuplicateDialogComponent;
  let fixture: ComponentFixture<DuplicateDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;
  let toastService: ToastServiceMockType;

  const mockProject: ProjectOverviewModel = {
    ...MOCK_PROJECT_OVERVIEW,
    id: 'project-1',
    title: 'Test Project',
  };

  const defaultSignals: SignalOverride[] = [
    { selector: ProjectOverviewSelectors.getProject, value: mockProject },
    { selector: ProjectOverviewSelectors.getDuplicateProjectSubmitting, value: false },
  ];

  function setup(overrides: BaseSetupOverrides = {}) {
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [DuplicateDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(ToastService, toastService),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(DuplicateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should not dispatch duplicate action when project is missing', () => {
    setup({
      selectorOverrides: [{ selector: ProjectOverviewSelectors.getProject, value: null }],
    });
    (store.dispatch as Mock).mockClear();

    component.handleDuplicateConfirm();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(DuplicateProject));
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should duplicate project, close dialog and show success toast', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.handleDuplicateConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new DuplicateProject('project-1', 'Test Project'));
    expect(dialogRef.close).toHaveBeenCalledWith();
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.duplicate.success');
  });
});
