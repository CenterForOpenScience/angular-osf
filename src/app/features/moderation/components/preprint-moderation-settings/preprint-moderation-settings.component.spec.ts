import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';

import { SettingsSectionControl } from '../../enums';
import { PreprintProviderModerationInfo } from '../../models';
import { PreprintModerationSelectors } from '../../store/preprint-moderation';

import { PreprintModerationSettingsComponent } from './preprint-moderation-settings.component';

import { EnvironmentTokenMock } from '@testing/mocks/environment.token.mock';
import { MOCK_PREPRINT_PROVIDER_MODERATION_INFO } from '@testing/mocks/preprint-provider-moderation-info.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintModerationSettingsComponent', () => {
  let component: PreprintModerationSettingsComponent;
  let fixture: ComponentFixture<PreprintModerationSettingsComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockProviderId = 'test-provider-id';
  const mockSettings: PreprintProviderModerationInfo = MOCK_PREPRINT_PROVIDER_MODERATION_INFO;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ providerId: mockProviderId }).build();

    await TestBed.configureTestingModule({
      imports: [PreprintModerationSettingsComponent, OSFTestingModule, MockComponent(LoadingSpinnerComponent)],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        EnvironmentTokenMock,
        provideMockStore({
          signals: [
            { selector: PreprintModerationSelectors.arePreprintProviderLoading, value: false },
            { selector: PreprintModerationSelectors.getPreprintProviders, value: [mockSettings] },
            { selector: PreprintModerationSelectors.getPreprintProvider, value: (_id: string) => mockSettings },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintModerationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.settingsForm).toBeDefined();
    expect(component.settingsForm.get(SettingsSectionControl.ModerationType)).toBeDefined();
    expect(component.settingsForm.get(SettingsSectionControl.CommentVisibility)).toBeDefined();
    expect(component.settingsForm.get(SettingsSectionControl.ModeratorComments)).toBeDefined();
  });

  it('should have providerId from route params', () => {
    expect(component.providerId()).toBe(mockProviderId);
  });

  it('should compute settings correctly', () => {
    expect(component.settings()).toBeDefined();
  });

  it('should compute isLoading correctly', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should initialize form with settings values', () => {
    component.ngOnInit();
    expect(component.settingsForm.get(SettingsSectionControl.ModerationType)?.value).toBe(mockSettings.reviewsWorkflow);
    expect(component.settingsForm.get(SettingsSectionControl.CommentVisibility)?.value).toBe(
      mockSettings.reviewsCommentsPrivate
    );
    expect(component.settingsForm.get(SettingsSectionControl.ModeratorComments)?.value).toBe(
      mockSettings.reviewsCommentsAnonymous
    );
  });

  it('should disable form initially', () => {
    component.ngOnInit();
    expect(component.settingsForm.disabled).toBe(true);
  });
});
