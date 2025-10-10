import { MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTypeInfoDialogComponent } from './resource-type-info-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ResourceTypeInfoDialogComponent', () => {
  let component: ResourceTypeInfoDialogComponent;
  let fixture: ComponentFixture<ResourceTypeInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceTypeInfoDialogComponent, OSFTestingModule],
      providers: [MockProvider(DynamicDialogRef)],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceTypeInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
