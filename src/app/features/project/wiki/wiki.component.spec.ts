import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { WikiComponent } from '@osf/features/project/wiki/wiki.component';
import { SubHeaderComponent } from '@osf/shared/components';
import { ToastService } from '@osf/shared/services';
import {
  CompareSectionComponent,
  EditSectionComponent,
  ViewSectionComponent,
  WikiListComponent,
} from '@shared/components/wiki';
import { WikiState } from '@shared/stores';

describe('WikiComponent', () => {
  let component: WikiComponent;
  let fixture: ComponentFixture<WikiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WikiComponent,
        MockComponent(SubHeaderComponent),
        MockComponent(WikiListComponent),
        MockComponent(ViewSectionComponent),
        MockComponent(EditSectionComponent),
        MockComponent(CompareSectionComponent),
        TranslatePipe,
        provideStore([WikiState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of({ id: '123' }),
            },
            snapshot: {
              queryParams: { wiki: 'test-wiki' },
            },
            queryParams: of({ wiki: 'test-wiki' }),
          },
        },
        MockProvider(Router),
        MockProvider(ToastService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
