import { MockComponent, MockDirective, MockProvider } from 'ng-mocks';

import { Textarea } from 'primeng/textarea';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TitleAndAbstractStepComponent } from '@osf/features/preprints/components';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { ToastService } from '@osf/shared/services/toast.service';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

describe('TitleAndAbstractStepComponent', () => {
  let component: TitleAndAbstractStepComponent;
  let fixture: ComponentFixture<TitleAndAbstractStepComponent>;

  const mockPreprint = PREPRINT_MOCK;

  function setup(overrides?: { createdPreprint?: typeof mockPreprint | null; providerId?: string }) {
    const mockToastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [TitleAndAbstractStepComponent, MockComponent(TextInputComponent), MockDirective(Textarea)],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build()),
        MockProvider(ToastService, mockToastService),
        provideMockStore({
          signals: [
            {
              selector: PreprintStepperSelectors.getPreprint,
              value: overrides && 'createdPreprint' in overrides ? overrides.createdPreprint : null,
            },
            {
              selector: PreprintStepperSelectors.isPreprintSubmitting,
              value: false,
            },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(TitleAndAbstractStepComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'providerId',
      overrides && 'providerId' in overrides ? overrides.providerId : 'provider-1'
    );
    fixture.detectChanges();
  }

  function fillValidForm() {
    component.titleAndAbstractForm.patchValue({
      title: 'Valid Title',
      description: 'Valid description with sufficient length',
    });
  }

  it('should initialize form with empty values', () => {
    setup();

    expect(component.titleAndAbstractForm.controls.title.value).toBe('');
    expect(component.titleAndAbstractForm.controls.description.value).toBe('');
    expect(component.titleAndAbstractForm.invalid).toBe(true);
  });

  it('should enforce title and description validation', () => {
    setup();

    component.titleAndAbstractForm.patchValue({ title: 'a'.repeat(513), description: 'Valid description' });
    expect(component.titleAndAbstractForm.controls.title.hasError('maxlength')).toBe(true);

    component.titleAndAbstractForm.patchValue({ title: 'Valid title', description: 'Short' });
    expect(component.titleAndAbstractForm.controls.description.hasError('minlength')).toBe(true);

    component.titleAndAbstractForm.patchValue({ title: 'Valid title', description: '' });
    expect(component.titleAndAbstractForm.controls.description.hasError('required')).toBe(true);
  });

  it('should patch form with existing preprint values', () => {
    setup({ createdPreprint: mockPreprint });

    expect(component.titleAndAbstractForm.controls.title.value).toBe(mockPreprint.title);
    expect(component.titleAndAbstractForm.controls.description.value).toBe(mockPreprint.description);
  });

  it('should not dispatch or emit when form is invalid', () => {
    setup();
    const emitSpy = jest.spyOn(component.nextClicked, 'emit');

    component.nextButtonClicked();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should create preprint and emit next when form is valid and no preprint exists', () => {
    setup({ createdPreprint: null, providerId: 'provider-1' });
    fillValidForm();
    const emitSpy = jest.spyOn(component.nextClicked, 'emit');

    component.nextButtonClicked();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should update preprint and emit next when form is valid and preprint exists', () => {
    setup({ createdPreprint: mockPreprint });
    fillValidForm();
    const emitSpy = jest.spyOn(component.nextClicked, 'emit');

    component.nextButtonClicked();

    expect(emitSpy).toHaveBeenCalled();
  });
});
