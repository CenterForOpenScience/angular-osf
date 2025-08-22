import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataResourceInformationComponent } from './metadata-resource-information.component';

describe('MetadataResourceInformationComponent', () => {
  let component: MetadataResourceInformationComponent;
  let fixture: ComponentFixture<MetadataResourceInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataResourceInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataResourceInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
