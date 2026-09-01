import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { MetadataTitleComponent } from './metadata-title.component';

describe('MetadataTitleComponent', () => {
  let component: MetadataTitleComponent;
  let fixture: ComponentFixture<MetadataTitleComponent>;

  const mockTitle = 'Title';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataTitleComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(MetadataTitleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title input', () => {
    fixture.componentRef.setInput('title', mockTitle);
    fixture.detectChanges();

    expect(component.title()).toEqual(mockTitle);
  });

  it('should set disabled inputs', () => {
    fixture.componentRef.setInput('title', mockTitle);
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('disabledButtonTooltip', 'Editing is disabled');
    fixture.detectChanges();

    expect(component.disabled()).toBe(true);
    expect(component.disabledButtonTooltip()).toBe('Editing is disabled');
  });

  it('should emit openEditTitleDialog event', () => {
    const emitSpy = vi.spyOn(component.openEditTitleDialog, 'emit');

    component.openEditTitleDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
