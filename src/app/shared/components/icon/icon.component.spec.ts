import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;
  let componentRef: ComponentRef<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty iconClass', () => {
    expect(component.iconClass()).toBe('');
  });

  it('should accept iconClass input', () => {
    componentRef.setInput('iconClass', 'fas fa-user');
    fixture.detectChanges();

    expect(component.iconClass()).toBe('fas fa-user');
  });

  it('should render span wrapper with correct classes', () => {
    fixture.detectChanges();

    const spanElement = fixture.debugElement.query(By.css('span'));
    expect(spanElement).toBeTruthy();
    expect(spanElement.nativeElement.className).toBe('flex align-items-center w-full h-full');
  });
});
