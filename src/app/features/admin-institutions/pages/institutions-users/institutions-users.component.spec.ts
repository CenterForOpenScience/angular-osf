import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsUsersComponent } from './institutions-users.component';

describe('InstitutionsUsersComponent', () => {
  let component: InstitutionsUsersComponent;
  let fixture: ComponentFixture<InstitutionsUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionsUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
