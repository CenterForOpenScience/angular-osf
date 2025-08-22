import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonsComponent } from './addons.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('AddonsComponent', () => {
  let component: AddonsComponent;
  let fixture: ComponentFixture<AddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonsComponent, OSFTestingStoreModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
