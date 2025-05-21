import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfilePartOfCollectionFilterComponent } from './my-profile-part-of-collection-filter.component';

describe('MyProfilePartOfCollectionFilterComponent', () => {
  let component: MyProfilePartOfCollectionFilterComponent;
  let fixture: ComponentFixture<MyProfilePartOfCollectionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfilePartOfCollectionFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfilePartOfCollectionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
