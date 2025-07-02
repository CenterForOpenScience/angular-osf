import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsSearchComponent } from './institutions-search.component';

describe('InstitutionsSearchComponent', () => {
  let component: InstitutionsSearchComponent;
  let fixture: ComponentFixture<InstitutionsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionsSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
