import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsSelectionListComponent } from '@osf/shared/components/components-selection-list/components-selection-list.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';

import { TogglePublicityDialogComponent } from './toggle-publicity-dialog.component';

describe('TogglePublicityDialogComponent', () => {
  let component: TogglePublicityDialogComponent;
  let fixture: ComponentFixture<TogglePublicityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TogglePublicityDialogComponent,
        ...MockComponents(ComponentsSelectionListComponent, LoadingSpinnerComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TogglePublicityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
