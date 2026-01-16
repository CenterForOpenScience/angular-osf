import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunderAwardsListComponent } from './funder-awards-list.component';

describe('FunderAwardsListComponent', () => {
  let component: FunderAwardsListComponent;
  let fixture: ComponentFixture<FunderAwardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunderAwardsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FunderAwardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
