import { provideStore } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ConfirmationService } from 'primeng/api';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { DeveloperAppsState } from '../../store';

import { DeveloperAppDetailsComponent } from './developer-app-details.component';

describe('DeveloperAppDetailsComponent', () => {
  let component: DeveloperAppDetailsComponent;
  let fixture: ComponentFixture<DeveloperAppDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperAppDetailsComponent, MockPipe(TranslatePipe)],
      providers: [
        ConfirmationService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([DeveloperAppsState]),
        MockProvider(TranslateService),
        MockProvider(ActivatedRoute, { params: of({}) }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperAppDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
