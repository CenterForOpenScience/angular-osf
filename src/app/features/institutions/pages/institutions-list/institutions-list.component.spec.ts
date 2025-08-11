import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { InstitutionsState } from '@osf/shared/stores';
import {
  CustomPaginatorComponent,
  LoadingSpinnerComponent,
  SearchInputComponent,
  SubHeaderComponent,
} from '@shared/components';

import { InstitutionsListComponent } from './institutions-list.component';

describe.skip('InstitutionsListComponent', () => {
  let component: InstitutionsListComponent;
  let fixture: ComponentFixture<InstitutionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InstitutionsListComponent,
        ...MockComponents(SubHeaderComponent, SearchInputComponent, CustomPaginatorComponent, LoadingSpinnerComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            queryParams: of({}),
          },
        },
        provideStore([InstitutionsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
