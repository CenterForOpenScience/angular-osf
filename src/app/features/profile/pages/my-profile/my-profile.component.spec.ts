import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSearchComponent } from '@osf/shared/components';

import { ProfileInformationComponent } from '../../components';

import { MyProfileComponent } from './my-profile.component';

describe.skip('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileComponent, [ProfileInformationComponent, GlobalSearchComponent]],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
