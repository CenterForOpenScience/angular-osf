import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { MetadataDescriptionComponent } from './metadata-description.component';

describe('MetadataDescriptionComponent', () => {
  let component: MetadataDescriptionComponent;
  let fixture: ComponentFixture<MetadataDescriptionComponent>;

  const mockDescription = 'This is a test  description.';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataDescriptionComponent],
      providers: [provideOSFCore()],
    });

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
    const emitSpy = vi.spyOn(component.openEditDescriptionDialog, 'emit');

    component.openEditDescriptionDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
