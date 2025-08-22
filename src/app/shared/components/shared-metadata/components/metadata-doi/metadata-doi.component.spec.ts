import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataDoiComponent } from './metadata-doi.component';

describe('MetadataDoiComponent', () => {
  let component: MetadataDoiComponent;
  let fixture: ComponentFixture<MetadataDoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataDoiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataDoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
