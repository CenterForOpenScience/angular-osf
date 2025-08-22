import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataSubjectsComponent } from './metadata-subjects.component';

describe('MetadataSubjectsComponent', () => {
  let component: MetadataSubjectsComponent;
  let fixture: ComponentFixture<MetadataSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataSubjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
