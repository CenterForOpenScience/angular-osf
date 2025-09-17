import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataTagsComponent } from './metadata-tags.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('MetadataTagsComponent', () => {
  let component: MetadataTagsComponent;
  let fixture: ComponentFixture<MetadataTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataTagsComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
