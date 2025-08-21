import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserState } from '@core/store/user';
import { TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';
import { ProjectsState } from '@shared/stores';

import { ProjectSelectorComponent } from './project-selector.component';

describe('ProjectSelectorComponent', () => {
  let component: ProjectSelectorComponent;
  let fixture: ComponentFixture<ProjectSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSelectorComponent, MockPipe(TranslatePipe)],
      providers: [
        TranslateServiceMock,
        MockProvider(ToastService),
        provideStore([ProjectsState, UserState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle project selection', () => {
    spyOn(component.projectChange, 'emit');
    const mockProject = { id: '1', title: 'Test Project' } as any;
    const mockEvent = { value: mockProject };

    component.handleProjectChange(mockEvent as any);

    expect(component.projectChange.emit).toHaveBeenCalledWith(mockProject);
  });

  it('should handle filter search', () => {
    const mockEvent = {
      originalEvent: { preventDefault: jasmine.createSpy() },
      filter: 'test filter',
    };

    component.handleFilterSearch(mockEvent as any);

    expect(mockEvent.originalEvent.preventDefault).toHaveBeenCalled();
  });
});
