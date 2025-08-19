import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonCardListComponent } from './addon-card-list.component';

describe('AddonCardListComponent', () => {
  let component: AddonCardListComponent;
  let fixture: ComponentFixture<AddonCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonCardListComponent],
      providers: [MockProvider(TranslateService)],
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

  it('should have default empty string ', () => {
    expect(component.cardButtonLabel()).toBe('');
  });

  it('should have default false value', () => {
    expect(component.showDangerButton()).toBe(false);
  });
});
