import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { SettingsSelectors } from '../../store';

import { DeleteProjectDialogComponent } from './delete-project-dialog.component';

describe('DeleteProjectDialogComponent', () => {
  let component: DeleteProjectDialogComponent;
  let fixture: ComponentFixture<DeleteProjectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeleteProjectDialogComponent],
      providers: [
        provideOSFCore(),
        MockProvider(ToastService),
        provideDynamicDialogRefMock(),
        provideMockStore({
          signals: [
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: [] },
            { selector: SettingsSelectors.isSettingsSubmitting, value: false },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(DeleteProjectDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
