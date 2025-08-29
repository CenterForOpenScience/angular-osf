import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule} from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { OSFTestingModule, OSFTestingStoreModule } from '@testing/osf.testing.module';
import {MOCK_PROJECTS} from '@shared/mocks/dasboard.mock';
import {MyResourcesSelectors} from '@shared/stores';
import {LoadingSpinnerComponent, MyProjectsTableComponent, SubHeaderComponent} from '@shared/components';
import { MockComponents } from 'ng-mocks';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  console.log('hello hello')
  const storeMock = {
    dispatch: jest.fn().mockReturnValue(of({})),
    selectSnapshot: jest.fn(),
    selectSignal: jest.fn(),
  };

  beforeEach(async () => {
    (storeMock.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === MyResourcesSelectors.getProjects) return () => MOCK_PROJECTS;
      if (selector === MyResourcesSelectors.getTotalProjects) return () => MOCK_PROJECTS.length;
      if (selector === MyResourcesSelectors.getProjectsLoading) return () => false;
      return () => null;
    });
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, ReactiveFormsModule, OSFTestingModule, OSFTestingStoreModule,
        ...MockComponents(SubHeaderComponent, MyProjectsTableComponent, LoadingSpinnerComponent)],
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
});
