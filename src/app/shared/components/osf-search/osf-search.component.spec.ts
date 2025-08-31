import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsfSearchComponent } from './osf-search.component';

describe.skip('OsfSearchComponent', () => {
  let component: OsfSearchComponent;
  let fixture: ComponentFixture<OsfSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsfSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OsfSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
