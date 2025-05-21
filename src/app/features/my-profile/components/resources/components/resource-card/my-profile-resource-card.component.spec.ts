import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileResourceCardComponent } from './my-profile-resource-card.component';

describe('MyProfileResourceCardComponent', () => {
  let component: MyProfileResourceCardComponent;
  let fixture: ComponentFixture<MyProfileResourceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileResourceCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileResourceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
