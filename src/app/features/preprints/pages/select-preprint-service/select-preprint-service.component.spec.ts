import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPreprintServiceComponent } from './select-preprint-service.component';

describe('SelectPreprintServiceComponent', () => {
  let component: SelectPreprintServiceComponent;
  let fixture: ComponentFixture<SelectPreprintServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPreprintServiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPreprintServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
