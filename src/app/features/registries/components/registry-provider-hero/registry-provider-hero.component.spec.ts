import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CustomDialogService } from '@osf/shared/services';

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
      imports: [RegistryProviderHeroComponent, OSFTestingModule],
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
});
