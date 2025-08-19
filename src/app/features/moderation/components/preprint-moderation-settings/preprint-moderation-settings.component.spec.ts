import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { PreprintModerationState } from '@osf/features/moderation/store/preprint-moderation';
import { LoadingSpinnerComponent } from '@shared/components';

import { PreprintModerationSettingsComponent } from './preprint-moderation-settings.component';

describe('PreprintModerationSettingsComponent', () => {
  let component: PreprintModerationSettingsComponent;
  let fixture: ComponentFixture<PreprintModerationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintModerationSettingsComponent, MockPipe(TranslatePipe), MockComponent(LoadingSpinnerComponent)],
      providers: [
        MockProvider(ActivatedRoute),
        provideStore([PreprintModerationState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintModerationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
