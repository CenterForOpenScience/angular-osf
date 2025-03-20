import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonCardComponent } from './addon-card.component';

describe('AddonCardComponent', () => {
  let component: AddonCardComponent;
  let fixture: ComponentFixture<AddonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
