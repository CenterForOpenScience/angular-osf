import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { FilesSelectors } from '../../store';

import { DraftFileDetailComponent } from './draft-file-detail.component';

describe('DraftFileDetailComponent', () => {
  let component: DraftFileDetailComponent;
  let fixture: ComponentFixture<DraftFileDetailComponent>;

  beforeEach(async () => {
    const mockRoute: Partial<ActivatedRoute> = {
      params: of({ fileGuid: 'test-file-guid' }),
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [DraftFileDetailComponent, MockComponent(SubHeaderComponent), MockComponent(LoadingSpinnerComponent)],
      providers: [
        provideOSFCore(),
        { provide: ActivatedRoute, useValue: mockRoute },
        MockProvider(Router, { url: '' }),
        MockProvider(ViewOnlyLinkHelperService, {
          hasViewOnlyParam: () => false,
          getViewOnlyParam: () => null,
        }),
        provideMockStore({
          signals: [
            { selector: FilesSelectors.isOpenedFileLoading, value: false },
            { selector: FilesSelectors.getOpenedFile, value: null },
          ],
        }),
      ],
    });
    fixture = TestBed.createComponent(DraftFileDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set safeLink when getIframeLink is called with a valid render link', () => {
    const mfrUrl = 'https://mfr.osf.io/render?url=https%3A%2F%2Fosf.io%2Fdownload%2Fch7jz%2F';
    component.file = signal({ links: { render: mfrUrl } }) as any;
    component.getIframeLink('');
    expect(component.safeLink).not.toBeNull();
  });

  it('should not set safeLink when file has no render link', () => {
    component.file = signal({ links: {} }) as any;
    component.safeLink = null;
    component.getIframeLink('');
    expect(component.safeLink).toBeNull();
  });

  it('should return null from getMfrUrlWithVersion when file has no render link', () => {
    component.file = signal({ links: {} }) as any;
    expect(component.getMfrUrlWithVersion('1')).toBeNull();
  });
});
