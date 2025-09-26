import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleAndAbstractStepComponent } from '@osf/features/preprints/components';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { TextInputComponent } from '@shared/components';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('TitleAndAbstractStepComponent', () => {
  let component: TitleAndAbstractStepComponent;
  let fixture: ComponentFixture<TitleAndAbstractStepComponent>;

  const mockPreprint = PREPRINT_MOCK;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleAndAbstractStepComponent, OSFTestingModule, MockComponent(TextInputComponent)],
      providers: [
        provideMockStore({
          signals: [
            {
              selector: PreprintStepperSelectors.getPreprint,
              value: null,
            },
            {
              selector: PreprintStepperSelectors.getSelectedProviderId,
              value: 'provider-1',
            },
            {
              selector: PreprintStepperSelectors.isPreprintSubmitting,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleAndAbstractStepComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.titleAndAbstractForm.get('title')?.value).toBe('');
    expect(component.titleAndAbstractForm.get('description')?.value).toBe('');
  });

  it('should have form invalid when fields are empty', () => {
    expect(component.titleAndAbstractForm.invalid).toBe(true);
  });

  it('should have form valid when fields are filled correctly', () => {
    component.titleAndAbstractForm.patchValue({
      title: 'Valid Title',
      description: 'Valid description with sufficient length',
    });
    expect(component.titleAndAbstractForm.valid).toBe(true);
  });

  it('should validate title max length', () => {
    const longTitle = 'a'.repeat(513);
    component.titleAndAbstractForm.patchValue({
      title: longTitle,
      description: 'Valid description',
    });
    expect(component.titleAndAbstractForm.get('title')?.hasError('maxlength')).toBe(true);
  });

  it('should validate description is required', () => {
    component.titleAndAbstractForm.patchValue({
      title: 'Valid Title',
      description: '',
    });
    expect(component.titleAndAbstractForm.get('description')?.hasError('required')).toBe(true);
  });

  it('should not proceed when form is invalid', () => {
    const nextClickedSpy = jest.spyOn(component.nextClicked, 'emit');
    component.nextButtonClicked();
    expect(nextClickedSpy).not.toHaveBeenCalled();
  });

  it('should emit nextClicked when form is valid and no existing preprint', () => {
    component.titleAndAbstractForm.patchValue({
      title: 'Valid Title',
      description: 'Valid description with sufficient length',
    });

    const nextClickedSpy = jest.spyOn(component.nextClicked, 'emit');
    component.nextButtonClicked();
    expect(nextClickedSpy).toHaveBeenCalled();
  });

  it('should initialize form with existing preprint data', () => {
    component.titleAndAbstractForm.patchValue({
      title: mockPreprint.title,
      description: mockPreprint.description,
    });
    expect(component.titleAndAbstractForm.get('title')?.value).toBe(mockPreprint.title);
    expect(component.titleAndAbstractForm.get('description')?.value).toBe(mockPreprint.description);
  });

  it('should emit nextClicked when form is valid and preprint exists', () => {
    component.titleAndAbstractForm.patchValue({
      title: mockPreprint.title,
      description: mockPreprint.description,
    });
    const nextClickedSpy = jest.spyOn(component.nextClicked, 'emit');
    component.nextButtonClicked();
    expect(nextClickedSpy).toHaveBeenCalled();
  });

  it('should emit nextClicked when form is valid and no existing preprint', () => {
    component.titleAndAbstractForm.patchValue({
      title: 'Test Title',
      description: 'Test description with sufficient length',
    });

    const nextClickedSpy = jest.spyOn(component.nextClicked, 'emit');
    component.nextButtonClicked();

    expect(nextClickedSpy).toHaveBeenCalled();
  });

  it('should emit nextClicked when form is valid and preprint exists', () => {
    jest.spyOn(component, 'createdPreprint').mockReturnValue(mockPreprint);

    component.titleAndAbstractForm.patchValue({
      title: 'Updated Title',
      description: 'Updated description with sufficient length',
    });

    const nextClickedSpy = jest.spyOn(component.nextClicked, 'emit');
    component.nextButtonClicked();

    expect(nextClickedSpy).toHaveBeenCalled();
  });

  it('should not emit nextClicked when form is invalid', () => {
    const nextClickedSpy = jest.spyOn(component.nextClicked, 'emit');

    component.nextButtonClicked();

    expect(nextClickedSpy).not.toHaveBeenCalled();
  });

  it('should have correct form validation for title and description', () => {
    component.titleAndAbstractForm.patchValue({
      title: '',
      description: 'Valid description',
    });
    expect(component.titleAndAbstractForm.get('title')?.hasError('required')).toBe(true);

    component.titleAndAbstractForm.patchValue({
      title: 'Valid Title',
      description: 'Short',
    });
    expect(component.titleAndAbstractForm.get('description')?.hasError('minlength')).toBe(true);

    component.titleAndAbstractForm.patchValue({
      title: 'Valid Title',
      description: 'Valid description with sufficient length',
    });
    expect(component.titleAndAbstractForm.valid).toBe(true);
  });
});
