import { MockProviders } from 'ng-mocks';

import { Clipboard } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@osf/shared/services/toast.service';

import { CopyButtonComponent } from './copy-button.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('CopyButtonComponent', () => {
  let component: CopyButtonComponent;
  let fixture: ComponentFixture<CopyButtonComponent>;
  let clipboard: jest.Mocked<Clipboard>;
  let toastService: jest.Mocked<ToastService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyButtonComponent, OSFTestingModule],
      providers: [MockProviders(Clipboard, ToastService)],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyButtonComponent);
    component = fixture.componentInstance;
    clipboard = TestBed.inject(Clipboard) as jest.Mocked<Clipboard>;
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.copyItem()).toBe('');
    expect(component.tooltip()).toBe('common.buttons.copy');
    expect(component.label()).toBe('');
    expect(component.severity()).toBe('contrast');
  });

  it('should accept copyItem input', () => {
    const testText = 'test text to copy';
    fixture.componentRef.setInput('copyItem', testText);
    fixture.detectChanges();

    expect(component.copyItem()).toBe(testText);
  });

  it('should accept tooltip input', () => {
    const customTooltip = 'custom.tooltip';
    fixture.componentRef.setInput('tooltip', customTooltip);
    fixture.detectChanges();

    expect(component.tooltip()).toBe(customTooltip);
  });

  it('should copy text and show success toast', () => {
    const testText = 'text to copy';
    fixture.componentRef.setInput('copyItem', testText);
    fixture.detectChanges();

    const copySpy = jest.spyOn(clipboard, 'copy');
    const showSuccessSpy = jest.spyOn(toastService, 'showSuccess');

    component.copy();

    expect(copySpy).toHaveBeenCalledWith(testText);
    expect(showSuccessSpy).toHaveBeenCalledWith('settings.developerApps.messages.copied');
  });

  it('should copy long text', () => {
    const longText = 'a'.repeat(1000);
    fixture.componentRef.setInput('copyItem', longText);
    fixture.detectChanges();

    const copySpy = jest.spyOn(clipboard, 'copy');
    const showSuccessSpy = jest.spyOn(toastService, 'showSuccess');

    component.copy();

    expect(copySpy).toHaveBeenCalledWith(longText);
    expect(showSuccessSpy).toHaveBeenCalledWith('settings.developerApps.messages.copied');
  });

  it('should copy special characters', () => {
    const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    fixture.componentRef.setInput('copyItem', specialText);
    fixture.detectChanges();

    const copySpy = jest.spyOn(clipboard, 'copy');
    const showSuccessSpy = jest.spyOn(toastService, 'showSuccess');

    component.copy();

    expect(copySpy).toHaveBeenCalledWith(specialText);
    expect(showSuccessSpy).toHaveBeenCalledWith('settings.developerApps.messages.copied');
  });
});
