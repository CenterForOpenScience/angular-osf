import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsDiscoverComponent } from './collections-discover.component';

describe('CollectionsDiscoverComponent', () => {
  let component: CollectionsDiscoverComponent;
  let fixture: ComponentFixture<CollectionsDiscoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsDiscoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
