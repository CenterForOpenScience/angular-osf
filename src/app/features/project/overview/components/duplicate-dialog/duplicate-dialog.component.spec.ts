import { Store } from '@ngxs/store';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@osf/shared/services/toast.service';

import { DuplicateProject, ProjectOverviewSelectors } from '../../store';

import { DuplicateDialogComponent } from './duplicate-dialog.component';

import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('DuplicateDialogComponent', () => {
  let component: DuplicateDialogComponent;
  let fixture: ComponentFixture<DuplicateDialogComponent>;
  let store: Store;

  const mockProject = { ...MOCK_NODE_WITH_ADMIN, id: 'proj-1', title: 'Test Project' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateDialogComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: mockProject },
            { selector: ProjectOverviewSelectors.getDuplicateProjectSubmitting, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DuplicateDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    (store.dispatch as jest.Mock).mockReturnValue(of(void 0));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return project and isSubmitting from store', () => {
    expect(component.project()).toEqual(mockProject);
    expect(component.isSubmitting()).toBe(false);
  });

  it('should dispatch DuplicateProject and on success close dialog and showSuccess', () => {
    (store.dispatch as jest.Mock).mockClear();

    component.handleDuplicateConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new DuplicateProject(mockProject.id, mockProject.title));
    expect(component.dialogRef.close).toHaveBeenCalled();
    expect(TestBed.inject(ToastService).showSuccess).toHaveBeenCalledWith(
      'project.overview.dialog.toast.duplicate.success'
    );
  });
});

describe('DuplicateDialogComponent when no project', () => {
  let component: DuplicateDialogComponent;
  let fixture: ComponentFixture<DuplicateDialogComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateDialogComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: null },
            { selector: ProjectOverviewSelectors.getDuplicateProjectSubmitting, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DuplicateDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    (store.dispatch as jest.Mock).mockClear();
    fixture.detectChanges();
  });

  it('should not dispatch when handleDuplicateConfirm', () => {
    component.handleDuplicateConfirm();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
