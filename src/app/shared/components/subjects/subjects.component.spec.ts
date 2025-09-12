import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE } from '@osf/shared/mocks';
import { SubjectsSelectors } from '@osf/shared/stores';

import { SubjectsComponent } from './subjects.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('SubjectsComponent', () => {
  let component: SubjectsComponent;
  let fixture: ComponentFixture<SubjectsComponent>;

  beforeEach(async () => {
    MOCK_STORE.selectSignal.mockImplementation((selector) => {
      switch (selector) {
        case SubjectsSelectors.getSubjects:
          return () => [];
        case SubjectsSelectors.getSubjectsLoading:
          return () => false;
        case SubjectsSelectors.getSearchedSubjects:
          return () => [];
        case SubjectsSelectors.getSearchedSubjectsLoading:
          return () => false;
      }
      return null;
    });
    await TestBed.configureTestingModule({
      imports: [SubjectsComponent, OSFTestingStoreModule],
      providers: [MockProvider(Store, MOCK_STORE)],
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
