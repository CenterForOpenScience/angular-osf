import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { provideRouter } from '@angular/router';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomDialogServiceMockBuilder,
  CustomDialogServiceMockType,
} from '@testing/providers/custom-dialog-provider.mock';

import { PreprintsHelpDialogComponent } from '../preprints-help-dialog/preprints-help-dialog.component';

import { PreprintProviderHeroComponent } from './preprint-provider-hero.component';

describe('PreprintProviderHeroComponent', () => {
  let component: PreprintProviderHeroComponent;
  let fixture: ComponentFixture<PreprintProviderHeroComponent>;
  let customDialogMock: CustomDialogServiceMockType;

  const mockPreprintProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;

  function setup(overrides?: {
    searchControl?: FormControl<string>;
    preprintProvider?: PreprintProviderDetails | undefined;
    isPreprintProviderLoading?: boolean;
  }) {
    customDialogMock = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();

    TestBed.configureTestingModule({
      imports: [PreprintProviderHeroComponent],
      providers: [provideOSFCore(), provideRouter([]), MockProvider(CustomDialogService, customDialogMock)],
    });

    fixture = TestBed.createComponent(PreprintProviderHeroComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'searchControl',
      overrides && 'searchControl' in overrides ? overrides.searchControl : new FormControl('', { nonNullable: true })
    );
    fixture.componentRef.setInput(
      'preprintProvider',
      overrides && 'preprintProvider' in overrides ? overrides.preprintProvider : mockPreprintProvider
    );
    fixture.componentRef.setInput(
      'isPreprintProviderLoading',
      overrides && 'isPreprintProviderLoading' in overrides ? overrides.isPreprintProviderLoading : false
    );
    fixture.detectChanges();
  }

  function query(selector: string): Element | null {
    return fixture.nativeElement.querySelector(selector);
  }

  it('should show skeletons while loading', () => {
    setup({ isPreprintProviderLoading: true, preprintProvider: undefined });

    expect(fixture.nativeElement.querySelectorAll('p-skeleton').length).toBeGreaterThan(0);
    expect(query('.preprint-provider-name')).toBeNull();
    expect(query('img')).toBeNull();
    expect(query('p-button')).toBeNull();
    expect(query('osf-search-input')).toBeNull();
  });

  it('should render provider info when not loading', () => {
    setup();

    expect(query('.preprint-provider-name')?.textContent).toBe('OSF Preprints');
    expect((query('img') as HTMLImageElement).getAttribute('src')).toBe('https://osf.io/assets/hero-logo.png');
    expect(query('.provider-description div')?.innerHTML).toContain('<p>Open preprints for all disciplines</p>');
  });

  it('should hide provider-dependent content when provider is undefined and not loading', () => {
    setup({ preprintProvider: undefined, isPreprintProviderLoading: false });

    expect(query('.preprint-provider-name')).toBeNull();
    expect(query('img')).toBeNull();
  });

  it('should emit normalized search value', () => {
    setup();
    vi.spyOn(component.triggerSearch, 'emit');

    component.onTriggerSearch('test “quoted” value');

    expect(component.triggerSearch.emit).toHaveBeenCalledWith('test "quoted" value');
  });

  it('should emit empty string when search value is missing', () => {
    setup();
    vi.spyOn(component.triggerSearch, 'emit');

    component.onTriggerSearch(undefined as unknown as string);

    expect(component.triggerSearch.emit).toHaveBeenCalledWith('');
  });

  it('should open help dialog with expected header', () => {
    setup();

    component.openHelpDialog();

    expect(customDialogMock.open).toHaveBeenCalledWith(PreprintsHelpDialogComponent, {
      header: 'preprints.helpDialog.header',
      width: '560px',
    });
  });
});
