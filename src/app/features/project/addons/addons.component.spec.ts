import { provideStore } from '@ngxs/store';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors, UserState } from '@core/store/user';
import { AddonsState } from '@osf/shared/stores';

import { AddonsComponent } from './addons.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('AddonsComponent', () => {
  let component: AddonsComponent;
  let fixture: ComponentFixture<AddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonsComponent, OSFTestingModule],
      providers: [
        provideStore([UserState, AddonsState]),
        {
          provide: UserSelectors,
          useValue: {
            getCurrentUser: () => signal({ id: 'mock-user' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
