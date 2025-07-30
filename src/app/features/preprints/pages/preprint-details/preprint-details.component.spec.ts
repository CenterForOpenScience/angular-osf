import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintDetailsComponent } from './preprint-details.component';

describe('PreprintDetailsComponent', () => {
  let component: PreprintDetailsComponent;
  let fixture: ComponentFixture<PreprintDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
