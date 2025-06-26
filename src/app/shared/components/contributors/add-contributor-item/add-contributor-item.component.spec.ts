import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContributorItemComponent } from './add-contributor-item.component';

describe('AddContributorItemComponent', () => {
  let component: AddContributorItemComponent;
  let fixture: ComponentFixture<AddContributorItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContributorItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddContributorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
