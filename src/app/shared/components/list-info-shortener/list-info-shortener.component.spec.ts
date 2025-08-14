import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ListInfoShortenerComponent } from './list-info-shortener.component';

describe('ListInfoShortenerComponent', () => {
  let component: ListInfoShortenerComponent;
  let fixture: ComponentFixture<ListInfoShortenerComponent>;
  let componentRef: ComponentRef<ListInfoShortenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListInfoShortenerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListInfoShortenerComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept limit input', () => {
    componentRef.setInput('limit', 3);
    fixture.detectChanges();

    expect(component.limit()).toBe(3);
  });

  it('should not render anything when data is empty', () => {
    componentRef.setInput('data', []);
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.flex.flex-row'));
    expect(container).toBeFalsy();
  });
});
