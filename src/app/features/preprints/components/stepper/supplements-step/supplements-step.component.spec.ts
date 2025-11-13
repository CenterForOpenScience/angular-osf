import { MockComponent, MockProvider } from 'ng-mocks';

import { ConfirmationService } from 'primeng/api';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { AddProjectFormComponent } from '@osf/shared/components/add-project-form/add-project-form.component';
import { ToastService } from '@osf/shared/services/toast.service';

import { SupplementsStepComponent } from './supplements-step.component';

import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

describe('SupplementsStepComponent', () => {
  let component: SupplementsStepComponent;
  let fixture: ComponentFixture<SupplementsStepComponent>;
  let mockToastService: ReturnType<typeof ToastServiceMock.simple>;

  beforeEach(async () => {
    mockToastService = ToastServiceMock.simple();

    await TestBed.configureTestingModule({
      imports: [SupplementsStepComponent, MockComponent(AddProjectFormComponent), OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            {
              selector: PreprintStepperSelectors.getPreprint,
              value: {},
            },
            {
              selector: PreprintStepperSelectors.isPreprintSubmitting,
              value: false,
            },
            {
              selector: PreprintStepperSelectors.getAvailableProjects,
              value: [],
            },
            {
              selector: PreprintStepperSelectors.areAvailableProjectsLoading,
              value: false,
            },
            {
              selector: PreprintStepperSelectors.getPreprintProject,
              value: null,
            },
            {
              selector: PreprintStepperSelectors.isPreprintProjectLoading,
              value: false,
            },
          ],
        }),
        TranslateServiceMock,
        MockProvider(ConfirmationService, {
          confirm: jest.fn(),
          close: jest.fn(),
        }),
        { provide: ToastService, useValue: mockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplementsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAvailableProjects when project name changes after debounce', () => {
    jest.useFakeTimers();

    const getAvailableProjectsSpy = jest.fn();
    Object.defineProperty(component, 'actions', {
      value: { getAvailableProjects: getAvailableProjectsSpy },
      writable: true,
    });

    component.ngOnInit();
    component.projectNameControl.setValue('test-project');
    jest.advanceTimersByTime(500);

    expect(getAvailableProjectsSpy).toHaveBeenCalledWith('test-project');
    jest.useRealTimers();
  });

  it('should not call getAvailableProjects if value is the same as selectedProjectId', () => {
    jest.useFakeTimers();
    const getAvailableProjectsSpy = jest.fn();

    Object.defineProperty(component, 'actions', {
      value: { getAvailableProjects: getAvailableProjectsSpy },
      writable: true,
    });
    jest.spyOn(component, 'selectedProjectId').mockReturnValue('test-project');

    component.ngOnInit();
    component.projectNameControl.setValue('test-project');
    jest.advanceTimersByTime(500);

    expect(getAvailableProjectsSpy).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should handle empty values', () => {
    jest.useFakeTimers();
    const getAvailableProjectsSpy = jest.fn();
    Object.defineProperty(component, 'actions', {
      value: { getAvailableProjects: getAvailableProjectsSpy },
      writable: true,
    });

    component.ngOnInit();
    component.projectNameControl.setValue('');
    jest.advanceTimersByTime(500);

    expect(getAvailableProjectsSpy).toHaveBeenCalledWith('');
    jest.useRealTimers();
  });
});
