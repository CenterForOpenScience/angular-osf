import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDeveloperAppComponent } from './create-developer-app.component';

describe('CreateDeveloperAppComponent', () => {
  let component: CreateDeveloperAppComponent;
  let fixture: ComponentFixture<CreateDeveloperAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDeveloperAppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDeveloperAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
