import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsSelectors } from '@osf/shared/stores/subjects';

import { SearchInputComponent } from '../search-input/search-input.component';

import { SubjectsComponent } from './subjects.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('SubjectsComponent', () => {
  let component: SubjectsComponent;
  let fixture: ComponentFixture<SubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsComponent, OSFTestingStoreModule, MockComponent(SearchInputComponent)],
      providers: [
        provideMockStore({
          signals: [
            { selector: SubjectsSelectors.getSubjects, value: [] },
            { selector: SubjectsSelectors.getSubjectsLoading, value: false },
            { selector: SubjectsSelectors.getSearchedSubjects, value: [] },
            { selector: SubjectsSelectors.getSearchedSubjectsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with label and description', () => {
    const headerElement = fixture.nativeElement.querySelector('h2');
    expect(headerElement.textContent).toEqual('shared.subjects.title');
    const descriptionElement = fixture.nativeElement.querySelector('p');
    expect(descriptionElement.textContent).toEqual('shared.subjects.description');
  });
});
