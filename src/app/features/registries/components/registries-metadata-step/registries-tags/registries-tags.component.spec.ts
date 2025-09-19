import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { MOCK_STORE } from '@osf/shared/mocks';

import { RegistriesTagsComponent } from './registries-tags.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('TagsComponent', () => {
  let component: RegistriesTagsComponent;
  let fixture: ComponentFixture<RegistriesTagsComponent>;
  const mockRoute = {
    snapshot: {
      params: of({ id: 'someId' }),
    },
    params: of(''),
  };

  MOCK_STORE.selectSignal.mockImplementation((selector) => {
    switch (selector) {
      case RegistriesSelectors.getSelectedTags:
        return () => [];
    }
    return null;
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OSFTestingStoreModule, RegistriesTagsComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockRoute }, MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with label', () => {
    const labelElement = fixture.nativeElement.querySelector('label');
    expect(labelElement.textContent).toEqual('project.overview.metadata.tags (common.labels.optional)');
  });
});
