import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsSelectionListComponent } from '@osf/shared/components/components-selection-list/components-selection-list.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { TogglePublicityDialogComponent } from './toggle-publicity-dialog.component';

describe.skip('TogglePublicityDialogComponent', () => {
  let component: TogglePublicityDialogComponent;
  let fixture: ComponentFixture<TogglePublicityDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TogglePublicityDialogComponent,
        ...MockComponents(ComponentsSelectionListComponent, LoadingSpinnerComponent),
      ],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(TogglePublicityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
