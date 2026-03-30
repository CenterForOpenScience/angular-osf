import { Store } from '@ngxs/store';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesSelectors, UpdateDraft } from '@osf/features/registries/store';

import { RegistriesTagsComponent } from './registries-tags.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesTagsComponent', () => {
  let component: RegistriesTagsComponent;
  let fixture: ComponentFixture<RegistriesTagsComponent>;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegistriesTagsComponent],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [{ selector: RegistriesSelectors.getSelectedTags, value: [] }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(RegistriesTagsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('draftId', 'someId');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with label', () => {
    const labelElement = fixture.nativeElement.querySelector('label');
    expect(labelElement.textContent).toEqual('project.overview.metadata.tags (common.labels.optional)');
  });

  it('should update tags on change', () => {
    component.onTagsChanged(['a', 'b']);
    expect(store.dispatch).toHaveBeenCalledWith(new UpdateDraft('someId', { tags: ['a', 'b'] }));
  });
});
