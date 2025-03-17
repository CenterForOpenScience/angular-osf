import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailComponent } from './add-email.component';

describe('AddEmailComponent', () => {
  let component: AddEmailComponent;
  let fixture: ComponentFixture<AddEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
