import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataDateInfoComponent } from './metadata-date-info.component';

describe('MetadataDateInfoComponent', () => {
  let component: MetadataDateInfoComponent;
  let fixture: ComponentFixture<MetadataDateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataDateInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataDateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
