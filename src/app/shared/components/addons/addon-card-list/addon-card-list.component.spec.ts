import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { AddonCardComponent } from '../addon-card/addon-card.component';

import { AddonCardListComponent } from './addon-card-list.component';

describe('AddonCardListComponent', () => {
  let component: AddonCardListComponent;
  let fixture: ComponentFixture<AddonCardListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddonCardListComponent, MockComponent(AddonCardComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(AddonCardListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default empty array', () => {
    expect(component.cards()).toEqual([]);
  });

  it('should have default false value', () => {
    expect(component.isConnected()).toBe(false);
  });
});
