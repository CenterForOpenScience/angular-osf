import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSearchComponent, LoadingSpinnerComponent } from '@osf/shared/components';

import { ProfileInformationComponent } from '../../components';

import { UserProfileComponent } from './user-profile.component';

describe.skip('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserProfileComponent,
        ...MockComponents(ProfileInformationComponent, GlobalSearchComponent, LoadingSpinnerComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
