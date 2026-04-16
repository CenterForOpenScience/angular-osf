import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Funder } from '@osf/features/metadata/models';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { FunderAwardsListComponent } from './funder-awards-list.component';

describe('FunderAwardsListComponent', () => {
  let component: FunderAwardsListComponent;
  let fixture: ComponentFixture<FunderAwardsListComponent>;

  const fundersMock: Funder[] = [
    {
      funderName: 'National Science Foundation',
      funderIdentifier: 'https://ror.org/021nxhr62',
      funderIdentifierType: 'ROR',
      awardNumber: 'NSF-123',
      awardUri: 'https://example.org/nsf-123',
      awardTitle: 'Grant 123',
    },
    {
      funderName: 'National Institutes of Health',
      funderIdentifier: 'https://ror.org/04zaypm56',
      funderIdentifierType: 'ROR',
      awardNumber: 'NIH-456',
      awardUri: 'https://example.org/nih-456',
      awardTitle: 'Grant 456',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FunderAwardsListComponent],
      providers: [provideOSFCore(), provideRouter([])],
    });
    fixture = TestBed.createComponent(FunderAwardsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.funders()).toEqual([]);
    expect(component.registryId()).toBeNull();
    expect(component.isLoading()).toBe(false);
  });

  it('should update isLoading input', () => {
    fixture.componentRef.setInput('isLoading', true);
    expect(component.isLoading()).toBe(true);
  });

  it('should update registryId input', () => {
    fixture.componentRef.setInput('registryId', 'abc123');
    expect(component.registryId()).toBe('abc123');
  });

  it('should update funders input', () => {
    fixture.componentRef.setInput('funders', fundersMock);
    expect(component.funders()).toEqual(fundersMock);
  });
});
