import { MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PreprintProviderDetails } from '@osf/features/preprints/models';

import { PreprintProviderHeroComponent } from './preprint-provider-hero.component';

import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { DialogServiceMockBuilder } from '@testing/providers/dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

describe('PreprintProviderHeroComponent', () => {
  let component: PreprintProviderHeroComponent;
  let fixture: ComponentFixture<PreprintProviderHeroComponent>;
  let mockDialogService: ReturnType<DialogServiceMockBuilder['build']>;

  const mockPreprintProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;

  beforeEach(async () => {
    mockDialogService = DialogServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [PreprintProviderHeroComponent, OSFTestingModule],
      providers: [
        MockProvider(DialogService, mockDialogService),
        MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build()),
        TranslationServiceMock,
      ],
    })
      .overrideComponent(PreprintProviderHeroComponent, {
        set: {
          providers: [{ provide: DialogService, useValue: mockDialogService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PreprintProviderHeroComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('searchControl', new FormControl(''));
    fixture.componentRef.setInput('preprintProvider', mockPreprintProvider);
    fixture.componentRef.setInput('isPreprintProviderLoading', false);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display loading skeletons when isPreprintProviderLoading is true', () => {
    fixture.componentRef.setInput('isPreprintProviderLoading', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const skeletons = compiled.querySelectorAll('p-skeleton');
    const providerName = compiled.querySelector('.preprint-provider-name');
    const providerLogo = compiled.querySelector('img');
    const addButton = compiled.querySelector('p-button');
    const searchInput = compiled.querySelector('osf-search-input');

    expect(skeletons.length).toBeGreaterThan(0);
    expect(providerName).toBeNull();
    expect(providerLogo).toBeNull();
    expect(addButton).toBeNull();
    expect(searchInput).toBeNull();
  });

  it('should display provider information when not loading', () => {
    fixture.componentRef.setInput('searchControl', new FormControl(''));
    fixture.componentRef.setInput('preprintProvider', mockPreprintProvider);
    fixture.componentRef.setInput('isPreprintProviderLoading', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const providerName = compiled.querySelector('.preprint-provider-name');
    const providerLogo = compiled.querySelector('img');
    const description = compiled.querySelector('.provider-description div');

    expect(providerName).toBeTruthy();
    expect(providerName?.textContent).toBe('OSF Preprints');
    expect(providerLogo).toBeTruthy();
    expect(providerLogo?.getAttribute('src')).toBe('https://osf.io/assets/hero-logo.png');
    expect(description).toBeTruthy();
    expect(description?.innerHTML).toContain('<p>Open preprints for all disciplines</p>');
  });

  it('should display add preprint button when allowSubmissions is true', () => {
    fixture.componentRef.setInput('searchControl', new FormControl(''));
    fixture.componentRef.setInput('preprintProvider', mockPreprintProvider);
    fixture.componentRef.setInput('isPreprintProviderLoading', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const addButton = compiled.querySelector('p-button');

    expect(addButton).toBeTruthy();
    expect(addButton?.getAttribute('ng-reflect-label')).toBe('Preprints.addpreprint');
    expect(addButton?.getAttribute('ng-reflect-router-link')).toBe('/preprints,osf-preprints,submi');
  });

  it('should display search input when not loading', () => {
    fixture.componentRef.setInput('searchControl', new FormControl(''));
    fixture.componentRef.setInput('preprintProvider', mockPreprintProvider);
    fixture.componentRef.setInput('isPreprintProviderLoading', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const searchInput = compiled.querySelector('osf-search-input');

    expect(searchInput).toBeTruthy();
    expect(searchInput?.getAttribute('ng-reflect-show-help-icon')).toBe('true');
    expect(searchInput?.getAttribute('ng-reflect-placeholder')).toBe('Preprints.searchplaceholder');
  });

  it('should emit triggerSearch when onTriggerSearch is called', () => {
    fixture.componentRef.setInput('searchControl', new FormControl(''));
    fixture.componentRef.setInput('preprintProvider', mockPreprintProvider);
    fixture.componentRef.setInput('isPreprintProviderLoading', false);
    fixture.detectChanges();

    jest.spyOn(component.triggerSearch, 'emit');
    const searchValue = 'test search query';

    component.onTriggerSearch(searchValue);

    expect(component.triggerSearch.emit).toHaveBeenCalledWith(searchValue);
  });

  it('should open help dialog when openHelpDialog is called', () => {
    fixture.componentRef.setInput('searchControl', new FormControl(''));
    fixture.componentRef.setInput('preprintProvider', mockPreprintProvider);
    fixture.componentRef.setInput('isPreprintProviderLoading', false);
    fixture.detectChanges();

    expect(mockDialogService.open).toBeDefined();
    expect(typeof mockDialogService.open).toBe('function');

    component.openHelpDialog();

    expect(mockDialogService.open).toHaveBeenCalledWith(expect.any(Function), {
      focusOnShow: false,
      header: 'preprints.helpDialog.header',
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  });

  it('should update when input properties change', () => {
    fixture.componentRef.setInput('searchControl', new FormControl(''));
    fixture.componentRef.setInput('preprintProvider', undefined);
    fixture.componentRef.setInput('isPreprintProviderLoading', true);
    fixture.detectChanges();

    let compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('p-skeleton').length).toBeGreaterThan(0);
    expect(compiled.querySelector('.preprint-provider-name')).toBeNull();

    fixture.componentRef.setInput('preprintProvider', mockPreprintProvider);
    fixture.componentRef.setInput('isPreprintProviderLoading', false);
    fixture.detectChanges();

    compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('p-skeleton').length).toBe(0);
    expect(compiled.querySelector('.preprint-provider-name')).toBeTruthy();
    expect(compiled.querySelector('.preprint-provider-name')?.textContent).toBe('OSF Preprints');
  });
});
