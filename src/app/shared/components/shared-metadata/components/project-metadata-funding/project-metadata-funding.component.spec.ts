import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Funder } from '@osf/features/project/metadata/models';
import { MOCK_FUNDERS, TranslateServiceMock } from '@shared/mocks';

import { ProjectMetadataFundingComponent } from './project-metadata-funding.component';

describe('ProjectMetadataFundingComponent', () => {
  let component: ProjectMetadataFundingComponent;
  let fixture: ComponentFixture<ProjectMetadataFundingComponent>;

  const mockFunders: Funder[] = MOCK_FUNDERS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataFundingComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataFundingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set funders input', () => {
    fixture.componentRef.setInput('funders', mockFunders);
    fixture.detectChanges();

    expect(component.funders()).toEqual(mockFunders);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });

  it('should emit openEditFundingDialog event', () => {
    const emitSpy = jest.spyOn(component.openEditFundingDialog, 'emit');

    component.openEditFundingDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
