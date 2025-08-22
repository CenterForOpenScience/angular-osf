import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataContributorsComponent } from './metadata-contributors.component';

describe('MetadataContributorsComponent', () => {
  let component: MetadataContributorsComponent;
  let fixture: ComponentFixture<MetadataContributorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataContributorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
