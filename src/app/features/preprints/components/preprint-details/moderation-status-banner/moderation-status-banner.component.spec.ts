import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationStatusBannerComponent } from './moderation-status-banner.component';

describe.skip('ModerationStatusBannerComponent', () => {
  let component: ModerationStatusBannerComponent;
  let fixture: ComponentFixture<ModerationStatusBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationStatusBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModerationStatusBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
