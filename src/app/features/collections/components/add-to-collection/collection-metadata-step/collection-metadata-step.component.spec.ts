import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionMetadataStepComponent } from './collection-metadata-step.component';

describe('CollectionMetadataStepComponent', () => {
  let component: CollectionMetadataStepComponent;
  let fixture: ComponentFixture<CollectionMetadataStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionMetadataStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionMetadataStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
