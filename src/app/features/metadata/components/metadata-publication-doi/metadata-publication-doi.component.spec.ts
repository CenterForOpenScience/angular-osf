import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifierModel } from '@shared/models/identifiers/identifier.model';

import { MetadataPublicationDoiComponent } from './metadata-publication-doi.component';

import { MOCK_PROJECT_IDENTIFIERS } from '@testing/mocks/project-overview.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('MetadataPublicationDoiComponent', () => {
  let component: MetadataPublicationDoiComponent;
  let fixture: ComponentFixture<MetadataPublicationDoiComponent>;

  const mockIdentifiers: IdentifierModel = MOCK_PROJECT_IDENTIFIERS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataPublicationDoiComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataPublicationDoiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.identifiers()).toEqual([]);
    expect(component.hideEditDoi()).toBe(false);
  });

  it('should set identifiers input', () => {
    fixture.componentRef.setInput('identifiers', mockIdentifiers);
    fixture.detectChanges();

    expect(component.identifiers()).toEqual(mockIdentifiers);
  });

  it('should set hideEditDoi input', () => {
    fixture.componentRef.setInput('hideEditDoi', true);
    fixture.detectChanges();

    expect(component.hideEditDoi()).toBe(true);
  });

  it('should emit openEditPublicationDoiDialog event', () => {
    const emitSpy = jest.spyOn(component.openEditPublicationDoiDialog, 'emit');

    component.openEditPublicationDoiDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
