import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { FundersListComponent } from './funders-list.component';

describe('FundersListComponent', () => {
  let component: FundersListComponent;
  let fixture: ComponentFixture<FundersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FundersListComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(FundersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.funders()).toBeUndefined();
    expect(component.isLoading()).toBe(false);
  });
});
