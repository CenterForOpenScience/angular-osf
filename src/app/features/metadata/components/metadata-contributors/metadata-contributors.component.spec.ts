import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ContributorsListComponent } from '@osf/shared/components';
import { ContributorModel } from '@osf/shared/models';
import { MOCK_CONTRIBUTOR, TranslateServiceMock } from '@shared/mocks';

import { MetadataContributorsComponent } from './metadata-contributors.component';

describe('MetadataContributorsComponent', () => {
  let component: MetadataContributorsComponent;
  let fixture: ComponentFixture<MetadataContributorsComponent>;

  const mockContributors: ContributorModel[] = [MOCK_CONTRIBUTOR];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataContributorsComponent, MockComponent(ContributorsListComponent)],
      providers: [TranslateServiceMock, MockProvider(ActivatedRoute)],
    }).compileComponents();

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
    const emitSpy = jest.spyOn(component.openEditContributorDialog, 'emit');

    component.openEditContributorDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
