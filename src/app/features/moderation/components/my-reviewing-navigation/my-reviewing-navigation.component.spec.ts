import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MOCK_PROVIDER } from '@testing/mocks/provider.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { PreprintModerationTab } from '../../enums';

import { MyReviewingNavigationComponent } from './my-reviewing-navigation.component';

describe('MyReviewingNavigationComponent', () => {
  let component: MyReviewingNavigationComponent;
  let fixture: ComponentFixture<MyReviewingNavigationComponent>;

  const mockProvider = MOCK_PROVIDER;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MyReviewingNavigationComponent],
      providers: [provideOSFCore(), provideRouter([])],
    });

    fixture = TestBed.createComponent(MyReviewingNavigationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', mockProvider);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have provider input', () => {
    expect(component.provider()).toEqual(mockProvider);
  });

  it('should have tab options defined', () => {
    expect(component.tabOptions).toBeDefined();
    expect(component.tabOptions.length).toBeGreaterThan(0);
  });

  it('should have tab option enum defined', () => {
    expect(component.tabOption).toBe(PreprintModerationTab);
  });

  it('should accept custom provider input', () => {
    const customProvider = { ...mockProvider, name: 'Custom Provider' };
    fixture.componentRef.setInput('provider', customProvider);
    expect(component.provider()).toEqual(customProvider);
  });
});
