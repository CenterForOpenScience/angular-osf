import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifierModel } from '@osf/shared/models/identifiers/identifier.model';

import { ResourceDoiComponent } from './resource-doi.component';

import { MOCK_PROJECT_IDENTIFIERS } from '@testing/mocks/project-overview.mock';

describe('ResourceDoiComponent', () => {
  let component: ResourceDoiComponent;
  let fixture: ComponentFixture<ResourceDoiComponent>;

  const mockIdentifiers: IdentifierModel[] = [
    MOCK_PROJECT_IDENTIFIERS,
    {
      id: 'identifier-2',
      type: 'identifiers',
      category: 'doi',
      value: '10.5678/another.doi',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceDoiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceDoiComponent);
    component = fixture.componentInstance;
  });

  it('should have default input values', () => {
    expect(component.identifiers()).toEqual([]);
    expect(component.isLoading()).toBe(false);
  });

  it('should set identifiers input correctly', () => {
    fixture.componentRef.setInput('identifiers', mockIdentifiers);
    expect(component.identifiers()).toEqual(mockIdentifiers);
  });

  it('should set isLoading input correctly', () => {
    fixture.componentRef.setInput('isLoading', true);
    expect(component.isLoading()).toBe(true);
  });
});
