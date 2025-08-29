import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@osf/shared/mocks';

import { MetadataDescriptionComponent } from './metadata-description.component';

describe('MetadataDescriptionComponent', () => {
  let component: MetadataDescriptionComponent;
  let fixture: ComponentFixture<MetadataDescriptionComponent>;

  const mockDescription = 'This is a test  description.';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataDescriptionComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataDescriptionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set description input', () => {
    fixture.componentRef.setInput('description', mockDescription);
    fixture.detectChanges();

    expect(component.description()).toEqual(mockDescription);
  });

  it('should emit openEditDescriptionDialog event', () => {
    const emitSpy = jest.spyOn(component.openEditDescriptionDialog, 'emit');

    component.openEditDescriptionDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
