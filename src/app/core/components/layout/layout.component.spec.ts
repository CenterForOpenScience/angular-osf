import { MockComponents, MockProvider } from 'ng-mocks';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IS_MEDIUM, IS_WEB } from '@osf/shared/helpers/breakpoints.tokens';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { OSFBannerComponent } from '../osf-banners/osf-banner.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';

import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let isWebSubject: BehaviorSubject<boolean>;
  let isMediumSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    isWebSubject = new BehaviorSubject<boolean>(true);
    isMediumSubject = new BehaviorSubject<boolean>(false);

    TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        ...MockComponents(
          ConfirmDialog,
          BreadcrumbComponent,
          FooterComponent,
          HeaderComponent,
          OSFBannerComponent,
          SidenavComponent,
          TopnavComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(IS_WEB, isWebSubject),
        MockProvider(IS_MEDIUM, isMediumSubject),
        MockProvider(ConfirmationService),
      ],
    });

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show desktop layout when isWeb is true', () => {
    isWebSubject.next(true);
    fixture.detectChanges();

    const desktopLayout = fixture.nativeElement.querySelector('.layout-desktop');
    const tabletLayout = fixture.nativeElement.querySelector('.layout-tablet');

    expect(desktopLayout).toBeTruthy();
    expect(tabletLayout).toBeFalsy();
  });

  it('should show tablet layout when isWeb is false', () => {
    isWebSubject.next(false);
    fixture.detectChanges();

    const desktopLayout = fixture.nativeElement.querySelector('.layout-desktop');
    const tabletLayout = fixture.nativeElement.querySelector('.layout-tablet');

    expect(desktopLayout).toBeFalsy();
    expect(tabletLayout).toBeTruthy();
  });
});
