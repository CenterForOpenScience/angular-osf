import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedProjectsComponent } from './linked-projects.component';

describe('LinkedProjectsComponent', () => {
  let component: LinkedProjectsComponent;
  let fixture: ComponentFixture<LinkedProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedProjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
