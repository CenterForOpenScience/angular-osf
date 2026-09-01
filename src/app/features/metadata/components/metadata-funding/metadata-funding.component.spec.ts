import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Funder } from '@osf/features/metadata/models';

import { MOCK_FUNDERS } from '@testing/mocks/funder.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { MetadataFundingComponent } from './metadata-funding.component';

describe('MetadataFundingComponent', () => {
  let component: MetadataFundingComponent;
  let fixture: ComponentFixture<MetadataFundingComponent>;

  const mockFunders: Funder[] = MOCK_FUNDERS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataFundingComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(MetadataFundingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set funders input', () => {
    fixture.componentRef.setInput('funders', mockFunders);
    fixture.detectChanges();

    expect(component.funders()).toEqual(mockFunders);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });

  it('should set disabled inputs', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('disabledButtonTooltip', 'Editing is disabled');
    fixture.detectChanges();

    expect(component.disabled()).toBe(true);
    expect(component.disabledButtonTooltip()).toBe('Editing is disabled');
  });

  it('should emit openEditFundingDialog event', () => {
    const emitSpy = vi.spyOn(component.openEditFundingDialog, 'emit');

    component.openEditFundingDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
