import { provideStore } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { BehaviorSubject, of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { IS_MEDIUM, IS_WEB, IS_XSMALL } from '@shared/utils';

import { InstitutionsState } from '../../shared/stores/institutions';

import { MyProjectsState } from './store/my-projects.state';
import { MyProjectsComponent } from './my-projects.component';

describe('MyProjectsComponent', () => {
  let component: MyProjectsComponent;
  let fixture: ComponentFixture<MyProjectsComponent>;
  let isXSmallSubject: BehaviorSubject<boolean>;
  let isMediumSubject: BehaviorSubject<boolean>;
  let isWebSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isXSmallSubject = new BehaviorSubject<boolean>(false);
    isMediumSubject = new BehaviorSubject<boolean>(false);
    isWebSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [MyProjectsComponent, TranslateModule.forRoot()],
      providers: [
        provideStore([MyProjectsState, InstitutionsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(DialogService),
        MockProvider(ActivatedRoute, { queryParams: of({}) }),
        MockProvider(IS_XSMALL, isXSmallSubject),
        MockProvider(IS_MEDIUM, isMediumSubject),
        MockProvider(IS_WEB, isWebSubject),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
