import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { MOCK_STORE } from '@shared/mocks';

import { ShareAndDownloadComponent } from './share-and-download.component';

describe.skip('ShareAndDownloadComponent', () => {
  let component: ShareAndDownloadComponent;
  let fixture: ComponentFixture<ShareAndDownloadComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === PreprintSelectors.getPreprint) return () => null;
      if (selector === PreprintSelectors.isPreprintLoading) return () => false;
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ShareAndDownloadComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareAndDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
