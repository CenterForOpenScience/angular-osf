import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@shared/mocks';
import { ContributorAddModel } from '@shared/models';

import { AddContributorItemComponent } from './add-contributor-item.component';

describe('AddContributorItemComponent', () => {
  let component: AddContributorItemComponent;
  let fixture: ComponentFixture<AddContributorItemComponent>;

  const mockContributorAdd: ContributorAddModel = {
    id: 'id1',
    isBibliographic: true,
    permission: 'read',
    fullName: 'John Doe',
    email: 'email@gmail.com',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContributorItemComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(AddContributorItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have required contributor input', () => {
    expect(() => component.contributor()).toThrow();
  });

  it('should accept contributor input', () => {
    fixture.componentRef.setInput('contributor', mockContributorAdd);
    fixture.detectChanges();

    expect(component.contributor()).toEqual(mockContributorAdd);
  });

  it('should handle contributor with minimal data', () => {
    const minimalContributor: ContributorAddModel = {
      id: 'minimal-id',
      isBibliographic: false,
      permission: 'read',
      fullName: 'Minimal User',
      email: 'minimal@example.com',
    };

    fixture.componentRef.setInput('contributor', minimalContributor);
    fixture.detectChanges();

    expect(component.contributor().id).toBe('minimal-id');
    expect(component.contributor().isBibliographic).toBe(false);
    expect(component.contributor().permission).toBe('read');
    expect(component.contributor().fullName).toBe('Minimal User');
    expect(component.contributor().email).toBe('minimal@example.com');
  });

  it('should update contributor data when input changes', () => {
    fixture.componentRef.setInput('contributor', mockContributorAdd);
    fixture.detectChanges();
    expect(component.contributor().fullName).toBe('John Doe');

    const updatedContributor: ContributorAddModel = {
      ...mockContributorAdd,
      fullName: 'Updated Name',
      permission: 'write',
    };

    fixture.componentRef.setInput('contributor', updatedContributor);
    fixture.detectChanges();

    expect(component.contributor().fullName).toBe('Updated Name');
    expect(component.contributor().permission).toBe('write');
  });
});
