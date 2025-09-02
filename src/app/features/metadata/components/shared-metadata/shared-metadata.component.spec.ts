import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE, TranslateServiceMock } from '@osf/shared/mocks';

import { SharedMetadataComponent } from './shared-metadata.component';

describe.skip('SharedMetadataComponent', () => {
  let component: SharedMetadataComponent;
  let fixture: ComponentFixture<SharedMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedMetadataComponent],
      providers: [TranslateServiceMock, MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedMetadataComponent);
    fixture.componentRef.setInput('metadata', null);
    fixture.componentRef.setInput('customItemMetadata', null);
    fixture.componentRef.setInput('selectedSubjects', []);
    fixture.componentRef.setInput('isSubjectsUpdating', false);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
