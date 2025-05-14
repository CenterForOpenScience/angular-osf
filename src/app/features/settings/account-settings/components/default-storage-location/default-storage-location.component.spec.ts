import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultStorageLocationComponent } from './default-storage-location.component';

describe('DefaultStorageLocationComponent', () => {
  let component: DefaultStorageLocationComponent;
  let fixture: ComponentFixture<DefaultStorageLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultStorageLocationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultStorageLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
