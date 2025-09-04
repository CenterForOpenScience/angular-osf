import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { AdditionalInfoComponent } from '@osf/features/preprints/components/preprint-details/additional-info/additional-info.component';
import { GeneralInformationComponent } from '@osf/features/preprints/components/preprint-details/general-information/general-information.component';
import { PreprintFileSectionComponent } from '@osf/features/preprints/components/preprint-details/preprint-file-section/preprint-file-section.component';
import { ShareAndDownloadComponent } from '@osf/features/preprints/components/preprint-details/share-and-downlaod/share-and-download.component';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { MOCK_PROVIDER, MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { Identifier } from '@shared/models';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { PreprintDetailsComponent } from './preprint-details.component';

describe('PreprintDetailsComponent', () => {
  let component: PreprintDetailsComponent;
  let fixture: ComponentFixture<PreprintDetailsComponent>;

  let dataciteService: jest.Mocked<DataciteService>;

  const preprintSignal = signal<any | null>({ id: 'p1', title: 'Test', description: '' });
  const mockRoute: Partial<ActivatedRoute> = {
    params: of({ providerId: 'osf', preprintId: 'p1' }),
    queryParams: of({ providerId: 'osf', preprintId: 'p1' }),
  };

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintProvidersSelectors.getPreprintProviderDetails('osf'):
          return () => MOCK_PROVIDER;
        case PreprintProvidersSelectors.isPreprintProviderDetailsLoading:
          return () => false;
        case PreprintSelectors.getPreprint:
          return preprintSignal;
        case PreprintSelectors.isPreprintLoading:
          return () => false;
        default:
          return () => [];
      }
    });
    (MOCK_STORE.dispatch as jest.Mock).mockImplementation(() => of());
    dataciteService = {
      logView: jest.fn().mockReturnValue(of(void 0)),
    } as unknown as jest.Mocked<DataciteService>;

    await TestBed.configureTestingModule({
      imports: [
        PreprintDetailsComponent,
        MockPipe(TranslatePipe),
        ...MockComponents(
          PreprintFileSectionComponent,
          ShareAndDownloadComponent,
          GeneralInformationComponent,
          AdditionalInfoComponent
        ),
      ],
      providers: [
        MockProvider(Store, MOCK_STORE),
        provideNoopAnimations(),
        { provide: DataciteService, useValue: dataciteService },
        MockProvider(Router),
        MockProvider(ActivatedRoute, mockRoute),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('isOsfPreprint should be true if providerId === osf', () => {
    expect(component.isOsfPreprint()).toBeTruthy();
  });

  it('reacts to sequence of state changes', () => {
    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalledTimes(0);

    preprintSignal.set(getPreprint([]));

    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalledTimes(0);

    preprintSignal.set(getPreprint([{ category: 'dio', value: '123', id: '', type: 'identifier' }]));
    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalledTimes(0);

    preprintSignal.set(getPreprint([{ category: 'doi', value: '123', id: '', type: 'identifier' }]));

    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalled();

    preprintSignal.set(getPreprint([{ category: 'doi', value: '456', id: '', type: 'identifier' }]));
    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenLastCalledWith('123');
  });
});

function getPreprint(identifiers: Identifier[]) {
  return {
    identifiers: identifiers,
  };
}
