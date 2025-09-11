import { Store } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { BehaviorSubject, of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IS_LARGE, IS_MEDIUM } from '@osf/shared/helpers';
import { MOCK_STORE } from '@shared/mocks';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { PreprintFileSectionComponent } from './preprint-file-section.component';

describe('PreprintFileSectionComponent', () => {
  let component: PreprintFileSectionComponent;
  let fixture: ComponentFixture<PreprintFileSectionComponent>;
  let dataciteService: jest.Mocked<DataciteService>;
  const mockStore = MOCK_STORE;
  let isMediumSubject: BehaviorSubject<boolean>;
  let isLargeSubject: BehaviorSubject<boolean>;
  // const

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (
        selector === PreprintSelectors.isPreprintFileLoading ||
        // selector === PreprintSelectors.getPreprintFileVersions ||
        selector === PreprintSelectors.arePreprintFileVersionsLoading
      ) {
        return () => [];
      } else if (selector == PreprintSelectors.getPreprint) {
        return () => ({
          id: 1,
        });
      } else if (selector == PreprintSelectors.getPreprintFileVersions) {
        return signal([{ date: '12312312', downloadUrl: '21312', id: '1' }]);
      }
      return () => null;
    });

    isMediumSubject = new BehaviorSubject<boolean>(false);
    isLargeSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [PreprintFileSectionComponent, TranslateModule.forRoot()],
      providers: [
        MockProvider(Store, mockStore),
        MockProvider(DataciteService, {
          logIdentifiableDownload: jest.fn().mockReturnValue(of(void 0)),
        }),
        MockProvider(IS_MEDIUM, isMediumSubject),
        MockProvider(IS_LARGE, isLargeSubject),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintFileSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dataciteService = TestBed.inject(DataciteService) as jest.MockedObject<DataciteService>;
  });

  it('should call dataciteService.logIdentifiableDownload when logDownload is called', () => {
    component.logDownload();
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(component.preprint$);
  });

  it('should call logDownload when version menu item is clicked', () => {
    // Get the command from versionMenuItems
    fixture.detectChanges();
    const menuItems = component.versionMenuItems();
    expect(menuItems.length).toBeGreaterThan(0);

    const versionCommand = menuItems[0].command!;
    jest.spyOn(component, 'logDownload');

    // simulate clicking the menu item
    versionCommand();

    expect(component.logDownload).toHaveBeenCalled();
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(expect.anything());
  });
});
