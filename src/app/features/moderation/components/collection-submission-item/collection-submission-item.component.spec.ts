import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipes } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { IconComponent } from '@shared/components';
import { DateAgoPipe } from '@shared/pipes';
import { CollectionsState } from '@shared/stores';

import { CollectionSubmissionItemComponent } from './collection-submission-item.component';

describe('SubmissionItemComponent', () => {
  let component: CollectionSubmissionItemComponent;
  let componentRef: ComponentRef<CollectionSubmissionItemComponent>;
  let fixture: ComponentFixture<CollectionSubmissionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionSubmissionItemComponent, MockComponent(IconComponent), MockPipes(DateAgoPipe, TranslatePipe)],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => '1' },
              queryParams: {},
            },
            queryParams: of({}),
          },
        },
        provideStore([CollectionsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionSubmissionItemComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('submission', {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
