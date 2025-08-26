import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { PreprintWarningBannerComponent } from './preprint-warning-banner.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('PreprintWarningBannerComponent', () => {
  let component: PreprintWarningBannerComponent;
  let fixture: ComponentFixture<PreprintWarningBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintWarningBannerComponent, OSFTestingModule],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintWarningBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct icon and text', () => {
    const banner: HTMLElement = fixture.nativeElement;
    const icon = banner.querySelector('i');
    const text = banner.querySelector('span');
    expect(icon).toBeDefined();
    expect(text).toBeDefined();
    expect(icon?.getAttribute('ng-reflect-ng-class')).toEqual('fas fa-triangle-exclamation');
    expect(text?.textContent?.trim()).toEqual('preprints.details.warningBanner');
  });
});
