import { MockProviders } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY, TranslateServiceMock } from '@shared/mocks';
import { ContributorModel } from '@shared/models';

import { ContributorsListComponent } from './contributors-list.component';

describe('ContributorsListComponent', () => {
  let component: ContributorsListComponent;
  let fixture: ComponentFixture<ContributorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorsListComponent],
      providers: [MockProviders(DialogService), TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.contributors()).toEqual([]);
    expect(component.isLoading()).toBe(false);
    expect(component.showCuratorColumn()).toBe(false);
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

  it('should accept showCuratorColumn input', () => {
    fixture.componentRef.setInput('showCuratorColumn', true);
    fixture.detectChanges();

    expect(component.showCuratorColumn()).toBe(true);
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

  it('should have dialogService injected', () => {
    expect(component['dialogService']).toBeDefined();
  });

  it('should have translateService injected', () => {
    expect(component['translateService']).toBeDefined();
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
    fixture.componentRef.setInput('showCuratorColumn', true);
    fixture.detectChanges();

    expect(component.showCuratorColumn()).toBe(true);
  });

  it('should handle all inputs together', () => {
    const contributors = [MOCK_CONTRIBUTOR];

    fixture.componentRef.setInput('contributors', contributors);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('showCuratorColumn', true);
    fixture.detectChanges();

    expect(component.contributors()).toEqual(contributors);
    expect(component.isLoading()).toBe(false);
    expect(component.showCuratorColumn()).toBe(true);
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
      fullName: 'Minimal User',
      givenName: 'Minimal User',
      familyName: 'Minimal User',
      permission: 'read',
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
