import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintModerationComponent } from './preprint-moderation.component';

describe('PreprintModerationComponent', () => {
  let component: PreprintModerationComponent;
  let fixture: ComponentFixture<PreprintModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintModerationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
