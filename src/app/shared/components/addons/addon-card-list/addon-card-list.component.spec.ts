import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonCardComponent } from '@shared/components/addons/addon-card/addon-card.component';

import { AddonCardListComponent } from './addon-card-list.component';

describe('AddonCardListComponent', () => {
  let component: AddonCardListComponent;
  let fixture: ComponentFixture<AddonCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonCardListComponent, MockComponent(AddonCardComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(AddonCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
