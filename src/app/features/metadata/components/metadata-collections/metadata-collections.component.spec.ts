import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataCollectionsComponent } from './metadata-collections.component';

describe('MetadataCollectionsComponent', () => {
  let component: MetadataCollectionsComponent;
  let fixture: ComponentFixture<MetadataCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataCollectionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
