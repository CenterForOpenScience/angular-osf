import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { PreprintWarningBannerComponent } from './preprint-warning-banner.component';

describe('PreprintWarningBannerComponent', () => {
  let component: PreprintWarningBannerComponent;
  let fixture: ComponentFixture<PreprintWarningBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreprintWarningBannerComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(PreprintWarningBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
