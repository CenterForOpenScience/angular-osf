import { provideStates } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';
import { MockComponents, MockModule } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { SearchInputComponent, SubHeaderComponent } from '@osf/shared/components';

import { MeetingsState } from '../../store';

import { MeetingsLandingComponent } from './meetings-landing.component';

describe('MeetingsLandingComponent', () => {
  let component: MeetingsLandingComponent;
  let fixture: ComponentFixture<MeetingsLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MeetingsLandingComponent,
        MockModule(TranslateModule),
        MockModule(RouterModule),
        ...MockComponents(SubHeaderComponent, SearchInputComponent),
      ],
      providers: [provideStates([MeetingsState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
