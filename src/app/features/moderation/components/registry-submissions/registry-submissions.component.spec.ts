import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrySubmissionsComponent } from './registry-submissions.component';

describe('RegistrySubmissionsComponent', () => {
  let component: RegistrySubmissionsComponent;
  let fixture: ComponentFixture<RegistrySubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrySubmissionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrySubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
