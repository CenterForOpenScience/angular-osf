import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperAppDetailsComponent } from './developer-app-details.component';

describe('DeveloperApplicationDetailsComponent', () => {
  let component: DeveloperAppDetailsComponent;
  let fixture: ComponentFixture<DeveloperAppDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperAppDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperAppDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
