import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@osf/shared/mocks';

import { MetadataTitleComponent } from './metadata-description.component';

describe('MetadataTitleComponent', () => {
  let component: MetadataTitleComponent;
  let fixture: ComponentFixture<MetadataTitleComponent>;

  const mockDescription = 'This is a test  description.';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataTitleComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataTitleComponent);
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
