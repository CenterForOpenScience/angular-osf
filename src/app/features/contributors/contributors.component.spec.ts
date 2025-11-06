import { MockComponents, MockProvider } from 'ng-mocks';

import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsTableComponent, RequestAccessTableComponent } from '@osf/shared/components/contributors';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { ViewOnlyTableComponent } from '@osf/shared/components/view-only-table/view-only-table.component';
import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import { ViewOnlyLinkSelectors } from '@osf/shared/stores/view-only-links';
import { ContributorModel } from '@shared/models/contributors/contributor.model';

import { ContributorsComponent } from './contributors.component';

import { MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY } from '@testing/mocks/contributors.mock';
import { MOCK_RESOURCE_INFO } from '@testing/mocks/resource.mock';
import { MOCK_PAGINATED_VIEW_ONLY_LINKS } from '@testing/mocks/view-only-link.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: Contributors', () => {
  let component: ContributorsComponent;
  let fixture: ComponentFixture<ContributorsComponent>;
  let customConfirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;

  const mockContributors: ContributorModel[] = [MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY];

  beforeAll(() => {
    if (typeof (globalThis as any).structuredClone !== 'function') {
      Object.defineProperty(globalThis as any, 'structuredClone', {
        configurable: true,
        writable: true,
        value: (o: unknown) => JSON.parse(JSON.stringify(o)),
      });
    }
  });

  beforeEach(async () => {
    jest.useFakeTimers();

    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        ContributorsComponent,
        OSFTestingModule,
        MockComponents(
          SearchInputComponent,
          ContributorsTableComponent,
          RequestAccessTableComponent,
          ViewOnlyTableComponent
        ),
      ],
      providers: [
        MockProvider(DialogService, {
          open: jest.fn().mockReturnValue({ onClose: of({}) }),
        }),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        MockProvider(ConfirmationService, {}),
        provideMockStore({
          signals: [
            { selector: ContributorsSelectors.getContributors, value: mockContributors },
            { selector: ContributorsSelectors.isContributorsLoading, value: false },
            { selector: ViewOnlyLinkSelectors.getViewOnlyLinks, value: MOCK_PAGINATED_VIEW_ONLY_LINKS },
            { selector: ViewOnlyLinkSelectors.isViewOnlyLinksLoading, value: false },
            { selector: CurrentResourceSelectors.getResourceDetails, value: MOCK_RESOURCE_INFO },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update search value with debounce', () => {
    expect(() => component.searchControl.setValue('test search')).not.toThrow();

    jest.advanceTimersByTime(600);

    expect(component.searchControl.value).toBe('test search');
  });

  it('should handle null search value', () => {
    expect(() => component.searchControl.setValue(null)).not.toThrow();

    jest.advanceTimersByTime(600);

    expect(component.searchControl.value).toBe(null);
  });

  it('should update permission filter', () => {
    expect(() => component.onPermissionChange(ContributorPermission.Read)).not.toThrow();
  });

  it('should update bibliography filter', () => {
    expect(() => component.onBibliographyChange(true)).not.toThrow();
  });

  it('should create view link', () => {
    const mockDialogRef = {
      onClose: of({ name: 'Test Link', anonymous: false }),
    };
    jest.spyOn(component.customDialogService, 'open').mockReturnValue(mockDialogRef as any);
    jest.spyOn(component.toastService, 'showSuccess');

    expect(() => component.createViewLink()).not.toThrow();
    expect(component.customDialogService.open).toHaveBeenCalled();
  });

  it('should delete view link with confirmation', () => {
    jest.spyOn(component.customConfirmationService, 'confirmDelete');
    jest.spyOn(component.toastService, 'showSuccess');

    component.deleteLinkItem(MOCK_PAGINATED_VIEW_ONLY_LINKS.items[0]);

    expect(component.customConfirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'myProjects.settings.delete.title',
      headerParams: { name: MOCK_PAGINATED_VIEW_ONLY_LINKS.items[0].name },
      messageKey: 'myProjects.settings.delete.message',
      onConfirm: expect.any(Function),
    });
  });

  it('should handle view link deletion confirmation', () => {
    let confirmCallback: () => void;
    jest.spyOn(component.customConfirmationService, 'confirmDelete').mockImplementation((options) => {
      confirmCallback = options.onConfirm;
    });
    jest.spyOn(component.toastService, 'showSuccess');

    component.deleteLinkItem(MOCK_PAGINATED_VIEW_ONLY_LINKS.items[0]);

    expect(() => confirmCallback!()).not.toThrow();
  });

  it('should detect changes correctly', () => {
    expect(component.hasChanges).toBe(false);

    const modifiedContributors = [...mockContributors];
    modifiedContributors[0].permission = ContributorPermission.Write;
    (component.contributors as any).set(modifiedContributors);

    expect((component.contributors as any)()).toEqual(modifiedContributors);
  });

  it('should cancel changes', () => {
    const modifiedContributors = [...mockContributors];
    modifiedContributors[0].permission = ContributorPermission.Write;
    (component.contributors as any).set(modifiedContributors);

    component.cancel();

    expect((component.contributors as any)()).toEqual(mockContributors);
  });

  it('should save changes', () => {
    jest.spyOn(component.toastService, 'showSuccess');

    const modifiedContributors = [...mockContributors];
    modifiedContributors[0].permission = ContributorPermission.Write;
    (component.contributors as any).set(modifiedContributors);

    expect(() => component.save()).not.toThrow();
  });

  it('should handle save errors', () => {
    jest.spyOn(component.toastService, 'showError');

    const modifiedContributors = [...mockContributors];
    modifiedContributors[0].permission = ContributorPermission.Write;
    (component.contributors as any).set(modifiedContributors);

    expect(() => component.save()).not.toThrow();
  });

  it('should update contributors when initialContributors changes', () => {
    const newContributors = [...mockContributors, MOCK_CONTRIBUTOR];

    expect(() => (component.contributors as any).set(newContributors)).not.toThrow();
    expect((component.contributors as any)()).toEqual(newContributors);
  });
});
