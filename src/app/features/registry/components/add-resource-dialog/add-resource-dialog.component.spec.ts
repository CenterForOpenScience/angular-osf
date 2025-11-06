import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';

import { ResourceFormComponent } from '../resource-form/resource-form.component';

import { AddResourceDialogComponent } from './add-resource-dialog.component';

describe('AddResourceDialogComponent', () => {
  let component: AddResourceDialogComponent;
  let fixture: ComponentFixture<AddResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddResourceDialogComponent,
        ...MockComponents(LoadingSpinnerComponent, ResourceFormComponent, IconComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
