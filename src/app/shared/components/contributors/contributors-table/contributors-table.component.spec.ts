import { MockProviders } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorPermission } from '@osf/shared/enums';
import { MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY, TranslateServiceMock } from '@osf/shared/mocks';
import { ContributorModel } from '@osf/shared/models';

import { ContributorsTableComponent } from './contributors-table.component';

describe('ContributorsTableComponent', () => {
  let component: ContributorsTableComponent;
  let fixture: ComponentFixture<ContributorsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorsTableComponent],
      providers: [MockProviders(DialogService), TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorsTableComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.contributors()).toEqual([]);
    expect(component.isLoading()).toBe(false);
    expect(component.showCurator()).toBe(false);
  });

  it('should accept contributors input', () => {
    const contributors = [MOCK_CONTRIBUTOR_WITHOUT_HISTORY];
    fixture.componentRef.setInput('contributors', contributors);
    fixture.detectChanges();

    expect(component.contributors()).toEqual(contributors);
  });

  it('should accept isLoading input', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });

  it('should accept showCurator input', () => {
    fixture.componentRef.setInput('showCurator', true);
    fixture.detectChanges();

    expect(component.showCurator()).toBe(true);
  });

  it('should have permissionsOptions defined', () => {
    expect(component['permissionsOptions']).toBeDefined();
    expect(Array.isArray(component['permissionsOptions'])).toBe(true);
  });

  it('should have skeletonData defined', () => {
    expect(component.skeletonData).toBeDefined();
    expect(Array.isArray(component.skeletonData)).toBe(true);
    expect(component.skeletonData.length).toBe(3);
  });

  it('should handle multiple contributors', () => {
    const contributors = [MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY];
    fixture.componentRef.setInput('contributors', contributors);
    fixture.detectChanges();

    expect(component.contributors()).toEqual(contributors);
    expect(component.contributors().length).toBe(2);
  });

  it('should handle loading state', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
    expect(component.skeletonData).toBeDefined();
  });

  it('should handle curator column visibility', () => {
    fixture.componentRef.setInput('showCurator', true);
    fixture.detectChanges();

    expect(component.showCurator()).toBe(true);
  });

  it('should handle all inputs together', () => {
    const contributors = [MOCK_CONTRIBUTOR];

    fixture.componentRef.setInput('contributors', contributors);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('showCurator', true);
    fixture.detectChanges();

    expect(component.contributors()).toEqual(contributors);
    expect(component.isLoading()).toBe(false);
    expect(component.showCurator()).toBe(true);
  });

  it('should handle empty contributors list', () => {
    fixture.componentRef.setInput('contributors', []);
    fixture.detectChanges();

    expect(component.contributors()).toEqual([]);
  });

  it('should handle contributor with minimal data', () => {
    const minimalContributor: ContributorModel = {
      id: 'minimal-id',
      userId: 'minimal-user-id',
      type: 'user',
      isBibliographic: true,
      isCurator: true,
      index: 0,
      isUnregisteredContributor: false,
      fullName: 'Minimal User',
      givenName: 'Minimal User',
      familyName: 'Minimal User',
      index: 0,
      permission: ContributorPermission.Read,
      education: [],
      employment: [],
    };

    fixture.componentRef.setInput('contributors', [minimalContributor]);
    fixture.detectChanges();

    expect(component.contributors()[0]).toEqual(minimalContributor);
  });

  it('should handle contributor data updates', () => {
    const initialContributors = [MOCK_CONTRIBUTOR];
    fixture.componentRef.setInput('contributors', initialContributors);
    fixture.detectChanges();

    const updatedContributors = [{ ...MOCK_CONTRIBUTOR, fullName: 'Updated Name' }];
    fixture.componentRef.setInput('contributors', updatedContributors);
    fixture.detectChanges();

    expect(component.contributors()[0].fullName).toBe('Updated Name');
  });
});
