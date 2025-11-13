import { MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { SettingsSelectors } from '../../store';

import { DeleteProjectDialogComponent } from './delete-project-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('DeleteProjectDialogComponent', () => {
  let component: DeleteProjectDialogComponent;
  let fixture: ComponentFixture<DeleteProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProjectDialogComponent, OSFTestingModule],
      providers: [
        MockProvider(ToastService),
        MockProvider(DynamicDialogRef),
        provideMockStore({
          signals: [
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: [] },
            { selector: SettingsSelectors.isSettingsSubmitting, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProjectDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
