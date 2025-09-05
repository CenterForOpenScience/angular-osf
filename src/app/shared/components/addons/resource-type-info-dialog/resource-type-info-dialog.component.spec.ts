import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTypeInfoDialogComponent } from './resource-type-info-dialog.component';

describe('ResourceTypeInfoDialogComponent', () => {
  let component: ResourceTypeInfoDialogComponent;
  let fixture: ComponentFixture<ResourceTypeInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceTypeInfoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceTypeInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
