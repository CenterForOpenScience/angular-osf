import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceInformationDialogComponent } from './resource-information-dialog.component';

describe('ResourceInformationDialogComponent', () => {
  let component: ResourceInformationDialogComponent;
  let fixture: ComponentFixture<ResourceInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceInformationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
