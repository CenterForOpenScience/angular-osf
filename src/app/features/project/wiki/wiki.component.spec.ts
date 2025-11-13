import { provideStore } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { CompareSectionComponent } from '@osf/shared/components/wiki/compare-section/compare-section.component';
import { EditSectionComponent } from '@osf/shared/components/wiki/edit-section/edit-section.component';
import { ViewSectionComponent } from '@osf/shared/components/wiki/view-section/view-section.component';
import { WikiListComponent } from '@osf/shared/components/wiki/wiki-list/wiki-list.component';
import { ToastService } from '@osf/shared/services/toast.service';
import { WikiState } from '@osf/shared/stores/wiki';

import { WikiComponent } from './wiki.component';

describe('WikiComponent', () => {
  let component: WikiComponent;
  let fixture: ComponentFixture<WikiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WikiComponent,
        ...MockComponents(
          SubHeaderComponent,
          WikiListComponent,
          ViewSectionComponent,
          EditSectionComponent,
          CompareSectionComponent,
          ViewOnlyLinkMessageComponent
        ),
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
