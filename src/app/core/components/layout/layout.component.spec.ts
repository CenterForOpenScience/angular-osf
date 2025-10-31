import { MockComponents, MockProvider } from 'ng-mocks';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IS_WEB } from '@osf/shared/helpers/breakpoints.tokens';

import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { OSFBannerComponent } from '../osf-banners/osf-banner.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';

import { LayoutComponent } from './layout.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Root', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let isWebSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        OSFTestingModule,
        ...MockComponents(
          HeaderComponent,
          FooterComponent,
          TopnavComponent,
          ConfirmDialog,
          BreadcrumbComponent,
          SidenavComponent,
          OSFBannerComponent
        ),
      ],
      providers: [MockProvider(IS_WEB, isWebSubject), MockProvider(ConfirmationService)],
    }).compileComponents();

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

  it('should contain confirm dialog component', () => {
    const confirmDialog = fixture.nativeElement.querySelector('p-confirm-dialog');
    expect(confirmDialog).toBeTruthy();
  });
});
