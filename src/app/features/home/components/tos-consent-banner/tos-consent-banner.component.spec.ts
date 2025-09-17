import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TosConsentBannerComponent } from './tos-consent-banner.component';

describe.skip('TosConsentBannerComponent', () => {
  let component: TosConsentBannerComponent;
  let fixture: ComponentFixture<TosConsentBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TosConsentBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TosConsentBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
