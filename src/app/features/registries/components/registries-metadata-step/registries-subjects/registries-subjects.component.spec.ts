import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { ResourceType } from '@osf/shared/enums';
import { SubjectsSelectors } from '@osf/shared/stores';

import { RegistriesSubjectsComponent } from './registries-subjects.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesSubjectsComponent', () => {
  let component: RegistriesSubjectsComponent;
  let fixture: ComponentFixture<RegistriesSubjectsComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();
    await TestBed.configureTestingModule({
      imports: [RegistriesSubjectsComponent, OSFTestingModule],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getDraftRegistration, value: { providerId: 'prov-1' } },
            { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
            { selector: SubjectsSelectors.getSubjects, value: [] },
            { selector: SubjectsSelectors.getSearchedSubjects, value: [] },
            { selector: SubjectsSelectors.getSubjectsLoading, value: false },
            { selector: SubjectsSelectors.getSearchedSubjectsLoading, value: false },
            { selector: SubjectsSelectors.areSelectedSubjectsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesSubjectsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', new FormControl([]));
    const mockActions = {
      fetchSubjects: jest.fn().mockReturnValue(of({})),
      fetchSelectedSubjects: jest.fn().mockReturnValue(of({})),
      fetchChildrenSubjects: jest.fn().mockReturnValue(of({})),
      updateResourceSubjects: jest.fn().mockReturnValue(of({})),
    } as any;
    Object.defineProperty(component, 'actions', { value: mockActions });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch subjects and selected subjects on init', () => {
    const actions = (component as any).actions;
    expect(actions.fetchSubjects).toHaveBeenCalledWith(ResourceType.Registration, 'prov-1');
    expect(actions.fetchSelectedSubjects).toHaveBeenCalledWith('draft-1', ResourceType.DraftRegistration);
  });

  it('should fetch children on demand', () => {
    const actions = (component as any).actions;
    component.getSubjectChildren('parent-1');
    expect(actions.fetchChildrenSubjects).toHaveBeenCalledWith('parent-1');
  });

  it('should search subjects', () => {
    const actions = (component as any).actions;
    component.searchSubjects('term');
    expect(actions.fetchSubjects).toHaveBeenCalledWith(ResourceType.Registration, 'prov-1', 'term');
  });

  it('should update selected subjects and control state', () => {
    const actions = (component as any).actions;
    const nextSubjects = [{ id: 's1' } as any];
    component.updateSelectedSubjects(nextSubjects);
    expect(actions.updateResourceSubjects).toHaveBeenCalledWith(
      'draft-1',
      ResourceType.DraftRegistration,
      nextSubjects
    );
    expect(component.control().value).toEqual(nextSubjects);
  });
});
