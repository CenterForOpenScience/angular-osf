import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import { ToastService } from '@osf/shared/services';

import { CompareSectionComponent } from './components/compare-section/compare-section.component';
import { EditSectionComponent } from './components/edit-section/edit-section.component';
import { ViewSectionComponent } from './components/view-section/view-section.component';
import { WikiListComponent } from './components/wiki-list/wiki-list.component';
import { WikiState } from './store';
import { WikiComponent } from './wiki.component';

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
