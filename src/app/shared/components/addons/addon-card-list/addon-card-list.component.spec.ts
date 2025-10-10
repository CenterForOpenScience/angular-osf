import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonCardComponent } from '@shared/components/addons';

import { AddonCardListComponent } from './addon-card-list.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('AddonCardListComponent', () => {
  let component: AddonCardListComponent;
  let fixture: ComponentFixture<AddonCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonCardListComponent, MockComponent(AddonCardComponent), OSFTestingModule],
    }).compileComponents();

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
