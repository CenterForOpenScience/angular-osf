import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationHistoryComponent, EmploymentHistoryComponent } from '@osf/shared/components';

import { ProfileInformationComponent } from './profile-information.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ProfileInformationComponent', () => {
  let component: ProfileInformationComponent;
  let fixture: ComponentFixture<ProfileInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileInformationComponent,
        ...MockComponents(EmploymentHistoryComponent, EducationHistoryComponent),
        OSFTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
