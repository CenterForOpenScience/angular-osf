import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorsTableComponent } from './moderators-table.component';

describe('ModeratorsTableComponent', () => {
  let component: ModeratorsTableComponent;
  let fixture: ComponentFixture<ModeratorsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModeratorsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
