// Dependencies
import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { TagModule } from 'primeng/tag';

import { of } from 'rxjs';

import { DestroyRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FileDetailComponent } from '@osf/features/files/pages/file-detail/file-detail.component';
import {
  LinkedResourcesComponent,
  OverviewComponentsComponent,
  OverviewToolbarComponent,
  OverviewWikiComponent,
  RecentActivityComponent,
} from '@osf/features/project/overview/components';
import {
  LoadingSpinnerComponent,
  ResourceMetadataComponent,
  SubHeaderComponent,
  ViewOnlyLinkMessageComponent,
} from '@shared/components';
import { MOCK_STORE } from '@shared/mocks';
import { CustomConfirmationService } from '@shared/services/custom-confirmation.service';
import { DataciteService } from '@shared/services/datacite/datacite.service';
import { ToastService } from '@shared/services/toast.service';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileDetailComponent', () => {
  let fixture: ComponentFixture<FileDetailComponent>;
  let component: FileDetailComponent;
  let dataciteService: jest.Mocked<DataciteService>;

  beforeEach(async () => {
    window.open = jest.fn();
    dataciteService = {
      logIdentifiableView: jest.fn().mockReturnValue(of(void 0)),
      logIdentifiableDownload: jest.fn().mockReturnValue(of(void 0)),
    } as unknown as jest.Mocked<DataciteService>;

    const mockRoute: Partial<ActivatedRoute> = {
      params: of({ providerId: 'osf', preprintId: 'p1' }),
      queryParams: of({ providerId: 'osf', preprintId: 'p1' }),
    };
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        default:
          return () => [];
      }
    });

    await TestBed.configureTestingModule({
      imports: [
        FileDetailComponent,
        OSFTestingModule,
        ButtonGroupModule,
        TagModule,
        SubHeaderComponent,
        FormsModule,
        LoadingSpinnerComponent,
        OverviewWikiComponent,
        OverviewComponentsComponent,
        LinkedResourcesComponent,
        RecentActivityComponent,
        OverviewToolbarComponent,
        ResourceMetadataComponent,
        TranslatePipe,
        Message,
        RouterLink,
        ViewOnlyLinkMessageComponent,
      ],
      providers: [
        TranslatePipe,
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Store, useValue: MOCK_STORE },
        { provide: DataciteService, useValue: dataciteService },
        Router,
        DestroyRef,
        MockProvider(ToastService),
        MockProvider(CustomConfirmationService),
        DialogService,
        TranslateService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call dataciteService.logIdentifiableDownload when downloadFile is triggered', () => {
    const link = '123';
    component.downloadFile(link);
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(component.fileMetadata$);
  });

  it('should call dataciteService.logIdentifiableView on start  ', () => {
    expect(dataciteService.logIdentifiableView).toHaveBeenCalledWith(component.fileMetadata$);
  });
});
