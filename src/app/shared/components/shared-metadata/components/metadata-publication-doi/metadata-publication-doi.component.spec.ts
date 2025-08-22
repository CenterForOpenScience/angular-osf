import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataPublicationDoiComponent } from './metadata-publication-doi.component';

describe('MetadataPublicationDoiComponent', () => {
  let component: MetadataPublicationDoiComponent;
  let fixture: ComponentFixture<MetadataPublicationDoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataPublicationDoiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataPublicationDoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
