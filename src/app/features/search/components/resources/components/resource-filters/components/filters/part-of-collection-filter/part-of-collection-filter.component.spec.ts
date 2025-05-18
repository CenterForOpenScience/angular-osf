import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartOfCollectionFilterComponent } from './part-of-collection-filter.component';

describe('PartOfCollectionFilterComponent', () => {
  let component: PartOfCollectionFilterComponent;
  let fixture: ComponentFixture<PartOfCollectionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartOfCollectionFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PartOfCollectionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
