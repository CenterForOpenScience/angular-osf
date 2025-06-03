import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCollectionFormComponent } from './add-to-collection-form.component';

describe('AddToCollectionFormComponent', () => {
  let component: AddToCollectionFormComponent;
  let fixture: ComponentFixture<AddToCollectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToCollectionFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToCollectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
