import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationBlocksDataComponent } from './registration-blocks-data.component';

describe.skip('RegistrationBlocksDataComponent', () => {
  let component: RegistrationBlocksDataComponent;
  let fixture: ComponentFixture<RegistrationBlocksDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationBlocksDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationBlocksDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
