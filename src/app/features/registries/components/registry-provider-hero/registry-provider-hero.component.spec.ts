import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CustomDialogService } from '@osf/shared/services';
import { SearchInputComponent } from '@shared/components';
import { DecodeHtmlPipe } from '@shared/pipes';

import { RegistryProviderHeroComponent } from './registry-provider-hero.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

describe('RegistryProviderHeroComponent', () => {
  let component: RegistryProviderHeroComponent;
  let fixture: ComponentFixture<RegistryProviderHeroComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  beforeEach(async () => {
    const mockRouter = RouterMockBuilder.create().withUrl('/x').build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    await TestBed.configureTestingModule({
      imports: [
        RegistryProviderHeroComponent,
        OSFTestingModule,
        MockComponent(SearchInputComponent),
        MockPipe(DecodeHtmlPipe),
      ],
      providers: [MockProvider(Router, mockRouter), MockProvider(CustomDialogService, mockCustomDialogService)],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryProviderHeroComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('provider', { id: 'prov-1', title: 'Provider', brand: undefined } as any);
    fixture.componentRef.setInput('isProviderLoading', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit triggerSearch on onTriggerSearch', () => {
    jest.spyOn(component.triggerSearch, 'emit');
    component.onTriggerSearch('abc');
    expect(component.triggerSearch.emit).toHaveBeenCalledWith('abc');
  });

  it('should open help dialog', () => {
    component.openHelpDialog();
    expect(mockCustomDialogService.open).toHaveBeenCalledWith(expect.any(Function), {
      header: 'preprints.helpDialog.header',
    });
  });

  it('should navigate to create page when provider id present', () => {
    const router = TestBed.inject(Router);
    const navSpy = jest.spyOn(router, 'navigate');
    fixture.componentRef.setInput('provider', { id: 'prov-1', title: 'Provider', brand: undefined } as any);
    component.navigateToCreatePage();
    expect(navSpy).toHaveBeenCalledWith(['/registries/prov-1/new']);
  });

  it('should not navigate when provider id missing', () => {
    const router = TestBed.inject(Router);
    const navSpy = jest.spyOn(router, 'navigate');
    fixture.componentRef.setInput('provider', { id: undefined, title: 'Provider', brand: undefined } as any);
    component.navigateToCreatePage();
    expect(navSpy).not.toHaveBeenCalled();
  });
});
