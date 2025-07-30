import { provideStates } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewToolbarComponent } from '@osf/features/project/overview/components';
import {
  DataResourcesComponent,
  LoadingSpinnerComponent,
  ResourceMetadataComponent,
  SubHeaderComponent,
} from '@osf/shared/components';
import { MyResourcesState } from '@osf/shared/stores';

import { RegistryRevisionsComponent, RegistryStatusesComponent } from '../../components';

import { RegistryOverviewComponent } from './registry-overview.component';

describe('RegistryOverviewComponent', () => {
  let component: RegistryOverviewComponent;
  let fixture: ComponentFixture<RegistryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegistryOverviewComponent,
        ...MockComponents(
          SubHeaderComponent,
          OverviewToolbarComponent,
          LoadingSpinnerComponent,
          ResourceMetadataComponent,
          RegistryRevisionsComponent,
          RegistryStatusesComponent,
          DataResourcesComponent
        ),
      ],
      providers: [provideStates([MyResourcesState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
