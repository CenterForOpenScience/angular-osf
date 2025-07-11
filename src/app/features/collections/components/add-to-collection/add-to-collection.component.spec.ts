import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCollectionComponent } from './add-to-collection.component';

describe('AddToCollectionFormComponent', () => {
  let component: AddToCollectionComponent;
  let fixture: ComponentFixture<AddToCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToCollectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
