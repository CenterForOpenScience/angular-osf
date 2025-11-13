import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { Textarea } from 'primeng/textarea';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { ProjectFormControls } from '@osf/shared/enums/create-project-form-controls.enum';

import { NodeDetailsModel } from '../../models';

import { SettingsProjectFormCardComponent } from './settings-project-form-card.component';

import { MOCK_NODE_DETAILS } from '@testing/mocks/node-details.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('SettingsProjectFormCardComponent', () => {
  let component: SettingsProjectFormCardComponent;
  let fixture: ComponentFixture<SettingsProjectFormCardComponent>;

  const mockNodeDetails = MOCK_NODE_DETAILS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SettingsProjectFormCardComponent,
        OSFTestingModule,
        MockComponent(TextInputComponent),
        MockPipe(TranslatePipe),
        MockDirective(Textarea),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsProjectFormCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('projectDetails', mockNodeDetails);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form with project details', () => {
    fixture.componentRef.setInput('projectDetails', mockNodeDetails);
    fixture.detectChanges();

    expect(component.projectForm.get(ProjectFormControls.Title)?.value).toBe(mockNodeDetails.title);
    expect(component.projectForm.get(ProjectFormControls.Description)?.value).toBe(mockNodeDetails.description);
  });

  it('should emit submitForm when form is valid and submitted', () => {
    jest.spyOn(component.submitForm, 'emit');
    fixture.componentRef.setInput('projectDetails', mockNodeDetails);
    fixture.detectChanges();

    component.projectForm.patchValue({
      [ProjectFormControls.Title]: 'Updated Title',
      [ProjectFormControls.Description]: 'Updated Description',
    });

    component.submit();

    expect(component.submitForm.emit).toHaveBeenCalledWith({
      title: 'Updated Title',
      description: 'Updated Description',
    });
  });

  it('should not emit submitForm when form is invalid', () => {
    jest.spyOn(component.submitForm, 'emit');
    fixture.componentRef.setInput('projectDetails', mockNodeDetails);
    fixture.detectChanges();

    component.projectForm.patchValue({
      [ProjectFormControls.Title]: '',
      [ProjectFormControls.Description]: 'Updated Description',
    });

    component.submit();

    expect(component.submitForm.emit).not.toHaveBeenCalled();
  });

  it('should emit deleteProject when delete button is clicked', () => {
    jest.spyOn(component.deleteProject, 'emit');
    fixture.componentRef.setInput('projectDetails', mockNodeDetails);
    fixture.detectChanges();

    component.deleteProject.emit();

    expect(component.deleteProject.emit).toHaveBeenCalled();
  });

  it('should reset form to original values', () => {
    fixture.componentRef.setInput('projectDetails', mockNodeDetails);
    fixture.detectChanges();

    component.projectForm.patchValue({
      [ProjectFormControls.Title]: 'Changed Title',
      [ProjectFormControls.Description]: 'Changed Description',
    });

    component.resetForm();

    expect(component.projectForm.get(ProjectFormControls.Title)?.value).toBe(mockNodeDetails.title);
    expect(component.projectForm.get(ProjectFormControls.Description)?.value).toBe(mockNodeDetails.description);
  });

  it('should update form when projectDetails input changes', () => {
    fixture.componentRef.setInput('projectDetails', mockNodeDetails);
    fixture.detectChanges();

    const newDetails: NodeDetailsModel = {
      ...mockNodeDetails,
      title: 'New Title',
      description: 'New Description',
    };

    fixture.componentRef.setInput('projectDetails', newDetails);
    fixture.detectChanges();

    expect(component.projectForm.get(ProjectFormControls.Title)?.value).toBe('New Title');
    expect(component.projectForm.get(ProjectFormControls.Description)?.value).toBe('New Description');
  });
});
