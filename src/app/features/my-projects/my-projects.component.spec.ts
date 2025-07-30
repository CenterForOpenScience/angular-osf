import { provideStore } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { BehaviorSubject, of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MyResourcesState } from '@shared/stores/my-resources/my-resources.state';
import { IS_MEDIUM } from '@shared/utils';

import { InstitutionsState } from '../../shared/stores/institutions';

import { MyProjectsComponent } from './my-projects.component';

describe('MyProjectsComponent', () => {
  let component: MyProjectsComponent;
  let fixture: ComponentFixture<MyProjectsComponent>;
  let isMediumSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isMediumSubject = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [MyProjectsComponent, TranslateModule.forRoot()],
      providers: [
        provideStore([MyResourcesState, InstitutionsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(DialogService),
        MockProvider(ActivatedRoute, { queryParams: of({}) }),
        MockProvider(IS_MEDIUM, isMediumSubject),
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
