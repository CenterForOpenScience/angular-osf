import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsMainContentComponent } from './collections-main-content.component';

describe('CollectionsSearchComponent', () => {
  let component: CollectionsMainContentComponent;
  let fixture: ComponentFixture<CollectionsMainContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsMainContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsMainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
