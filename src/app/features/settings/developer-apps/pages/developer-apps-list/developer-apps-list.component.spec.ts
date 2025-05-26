import { provideStore } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ConfirmationService } from 'primeng/api';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperAppsState } from '../../store';

import { DeveloperAppsListComponent } from './developer-apps-list.component';

describe('DeveloperApplicationsListComponent', () => {
  let component: DeveloperAppsListComponent;
  let fixture: ComponentFixture<DeveloperAppsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperAppsListComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([DeveloperAppsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(ConfirmationService),
        MockProvider(TranslateService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperAppsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
