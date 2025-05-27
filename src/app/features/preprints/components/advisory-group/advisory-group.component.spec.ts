import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryGroupComponent } from './advisory-group.component';

describe('AdvisoryGroupComponent', () => {
  let component: AdvisoryGroupComponent;
  let fixture: ComponentFixture<AdvisoryGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvisoryGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvisoryGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
