import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ContributorModel } from '@shared/models/contributors/contributor.model';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

import { MetadataContributorsComponent } from './metadata-contributors.component';

describe('MetadataContributorsComponent', () => {
  let component: MetadataContributorsComponent;
  let fixture: ComponentFixture<MetadataContributorsComponent>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  const mockContributors: ContributorModel[] = [MOCK_CONTRIBUTOR];

  beforeEach(() => {
    activatedRouteMock = ActivatedRouteMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [MetadataContributorsComponent, MockComponent(ContributorsListComponent)],
      providers: [provideOSFCore(), MockProvider(ActivatedRoute, activatedRouteMock)],
    });

    fixture = TestBed.createComponent(MetadataContributorsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.contributors()).toEqual([]);
    expect(component.readonly()).toBe(false);
  });

  it('should set contributors input', () => {
    fixture.componentRef.setInput('contributors', mockContributors);
    fixture.detectChanges();

    expect(component.contributors()).toEqual(mockContributors);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });

  it('should emit openEditContributorDialog event', () => {
    const emitSpy = vi.spyOn(component.openEditContributorDialog, 'emit');

    component.openEditContributorDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
