import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserState } from '@osf/core/store/user';

import { AccountSettingsState } from '../../store';

import { AffiliatedInstitutionsComponent } from './affiliated-institutions.component';

describe('AffiliatedInstitutionsComponent', () => {
  let component: AffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliatedInstitutionsComponent, MockPipe(TranslatePipe)],
      providers: [provideStore([AccountSettingsState, UserState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliatedInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
