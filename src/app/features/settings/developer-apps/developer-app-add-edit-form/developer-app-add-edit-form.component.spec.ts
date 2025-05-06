import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperAppAddEditFormComponent } from './developer-app-add-edit-form.component';

describe('CreateDeveloperAppComponent', () => {
  let component: DeveloperAppAddEditFormComponent;
  let fixture: ComponentFixture<DeveloperAppAddEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperAppAddEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperAppAddEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
