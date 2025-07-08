import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsListComponent } from './institutions-list.component';

describe('InstitutionsListComponent', () => {
  let component: InstitutionsListComponent;
  let fixture: ComponentFixture<InstitutionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
