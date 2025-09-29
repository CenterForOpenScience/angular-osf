import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSearchComponent } from '@osf/shared/components';

import { ProfileInformationComponent } from './components';
import { ProfileComponent } from './profile.component';

describe.skip('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, [ProfileInformationComponent, GlobalSearchComponent]],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
