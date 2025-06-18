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
  let router: Router;
  let toastService: ToastService;

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
    router = TestBed.inject(Router);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize with correct project ID', () => {
  //   expect(component.projectId()).toBe('123');
  // });

  // it('should toggle mode', () => {
  //   const toggleModeSpy = jest.spyOn(component['actions'], 'toggleMode');
  //   component.toggleMode(WikiModes.Edit);
  //   expect(toggleModeSpy).toHaveBeenCalledWith(WikiModes.Edit);
  // });

  // it('should update wiki preview content', () => {
  //   const updatePreviewSpy = jest.spyOn(component['actions'], 'updateWikiPreviewContent');
  //   const testContent = 'test content';
  //   component.updateWikiPreviewContent(testContent);
  //   expect(updatePreviewSpy).toHaveBeenCalledWith(testContent);
  // });

  // it('should handle wiki creation', () => {
  //   const routerSpy = jest.spyOn(router, 'navigate');
  //   component.onCreateWiki();
  //   expect(routerSpy).toHaveBeenCalled();
  // });

  // it('should handle wiki deletion', () => {
  //   const deleteWikiSpy = jest.spyOn(component['actions'], 'deleteWiki');
  //   component.onDeleteWiki();
  //   expect(deleteWikiSpy).toHaveBeenCalled();
  // });

  // it('should handle content saving', () => {
  //   const createVersionSpy = jest.spyOn(component['actions'], 'createWikiVersion');
  //   const testContent = 'test content';
  //   component.onSaveContent(testContent);
  //   expect(createVersionSpy).toHaveBeenCalled();
  // });
});
