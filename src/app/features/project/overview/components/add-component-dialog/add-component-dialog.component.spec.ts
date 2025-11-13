import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components/affiliated-institution-select/affiliated-institution-select.component';

import { AddComponentDialogComponent } from './add-component-dialog.component';

describe('AddComponentComponent', () => {
  let component: AddComponentDialogComponent;
  let fixture: ComponentFixture<AddComponentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddComponentDialogComponent, MockComponent(AffiliatedInstitutionSelectComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
