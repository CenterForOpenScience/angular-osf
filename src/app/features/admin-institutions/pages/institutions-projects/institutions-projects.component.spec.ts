import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsProjectsComponent } from './institutions-projects.component';

describe('InstitutionsProjectsComponent', () => {
  let component: InstitutionsProjectsComponent;
  let fixture: ComponentFixture<InstitutionsProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionsProjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
