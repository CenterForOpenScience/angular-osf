import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ContributorsListShortenerComponent } from './contributors-list-shortener.component';

describe('ContributorsListShortenerComponent', () => {
  let component: ContributorsListShortenerComponent;
  let fixture: ComponentFixture<ContributorsListShortenerComponent>;
  let componentRef: ComponentRef<ContributorsListShortenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorsListShortenerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorsListShortenerComponent);
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
