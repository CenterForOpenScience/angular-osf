import { MockComponents, MockProvider } from 'ng-mocks';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { HeaderComponent } from '@core/components/header/header.component';
import { TopnavComponent } from '@core/components/topnav/topnav.component';
import { IS_WEB, IS_XSMALL } from '@osf/shared/helpers';

import { SidenavComponent } from '../sidenav/sidenav.component';

import { RootComponent } from './root.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;
  let isWebSubject: BehaviorSubject<boolean>;
  let isMobileSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);
    isMobileSubject = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [
        RootComponent,
        OSFTestingModule,
        ...MockComponents(
          HeaderComponent,
          FooterComponent,
          TopnavComponent,
          ConfirmDialog,
          BreadcrumbComponent,
          SidenavComponent
        ),
      ],
      providers: [
        MockProvider(IS_WEB, isWebSubject),
        MockProvider(IS_XSMALL, isMobileSubject),
        MockProvider(ConfirmationService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RootComponent);
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

  it('should hide breadcrumb in tablet layout when mobile', () => {
    isWebSubject.next(false);
    isMobileSubject.next(true);
    fixture.detectChanges();

    const breadcrumb = fixture.nativeElement.querySelector('osf-breadcrumb');
    expect(breadcrumb).toBeFalsy();
  });

  it('should contain confirm dialog component', () => {
    const confirmDialog = fixture.nativeElement.querySelector('p-confirm-dialog');
    expect(confirmDialog).toBeTruthy();
  });
});
