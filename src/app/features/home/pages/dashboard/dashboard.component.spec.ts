import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { LoadingSpinnerComponent, MyProjectsTableComponent, SubHeaderComponent } from '@shared/components';
import { MyResourcesSelectors } from '@shared/stores';

import { DashboardComponent } from './dashboard.component';

import { getProjectsMockForComponent } from '@testing/data/dashboard/dasboard.data';
import { OSFTestingModule, OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const storeMock = {
    dispatch: jest.fn().mockReturnValue(of({})),
    selectSnapshot: jest.fn(),
    selectSignal: jest.fn(),
  };

  beforeEach(async () => {
    (storeMock.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === MyResourcesSelectors.getProjects) return () => getProjectsMockForComponent();
      if (selector === MyResourcesSelectors.getTotalProjects) return () => getProjectsMockForComponent().length;
      if (selector === MyResourcesSelectors.getProjectsLoading) return () => false;
      return () => null;
    });
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        ReactiveFormsModule,
        OSFTestingModule,
        OSFTestingStoreModule,
        ...MockComponents(SubHeaderComponent, MyProjectsTableComponent, LoadingSpinnerComponent),
      ],
      providers: [{ provide: Store, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show loading spinner when projects are loading', () => {
    jest.spyOn(component, 'areProjectsLoading').mockReturnValue(true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.directive(LoadingSpinnerComponent));
    expect(spinner).toBeTruthy();
  });

  it('should render projects table when projects exist', () => {
    jest.spyOn(component, 'areProjectsLoading').mockReturnValue(false);
    jest.spyOn(component, 'existsProjects').mockReturnValue(true);
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.directive(MyProjectsTableComponent));
    expect(table).toBeTruthy();
  });

  it('should render welcome video when no projects exist', () => {
    jest.spyOn(component, 'areProjectsLoading').mockReturnValue(false);
    jest.spyOn(component, 'existsProjects').mockReturnValue(false);

    fixture.detectChanges();

    const iframe = fixture.debugElement.query(By.css('iframe'));
    expect(iframe).toBeTruthy();
    expect(iframe.nativeElement.src).toContain('youtube.com');
  });

  it('should render welcome screen when no projects exist', () => {
    jest.spyOn(component, 'areProjectsLoading').mockReturnValue(false);
    jest.spyOn(component, 'existsProjects').mockReturnValue(false);
    fixture.detectChanges();

    const welcomeText = fixture.debugElement.nativeElement.textContent;
    expect(welcomeText).toContain('home.loggedIn.dashboard.noCreatedProject');
  });

  it('should open OSF help link in new tab when openInfoLink is called', () => {
    const spy = jest.spyOn(window, 'open').mockImplementation(() => null);
    component.openInfoLink();
    expect(spy).toHaveBeenCalledWith('https://help.osf.io/', '_blank');
  });

  it('should render product images after loading spinner disappears', () => {
    jest.spyOn(component, 'areProjectsLoading').mockReturnValue(true);
    fixture.detectChanges();

    let productImages = fixture.debugElement
      .queryAll(By.css('img'))
      .filter((img) => img.nativeElement.getAttribute('src')?.includes('assets/images/dashboard/products/'));

    expect(productImages.length).toBe(0);

    const spinner = fixture.debugElement.query(By.css('osf-loading-spinner'));
    expect(spinner).toBeTruthy();

    jest.spyOn(component, 'areProjectsLoading').mockReturnValue(false);
    fixture.detectChanges();

    productImages = fixture.debugElement
      .queryAll(By.css('img'))
      .filter((img) => img.nativeElement.getAttribute('src')?.includes('assets/images/dashboard/products/'));

    expect(productImages.length).toBe(4);

    const sources = productImages.map((img) => img.nativeElement.getAttribute('src'));

    expect(sources).toEqual(
      expect.arrayContaining([
        'assets/images/dashboard/products/osf-collections.png',
        'assets/images/dashboard/products/osf-institutions.png',
        'assets/images/dashboard/products/osf-registries.png',
        'assets/images/dashboard/products/osf-preprints.png',
      ])
    );
  });
});
