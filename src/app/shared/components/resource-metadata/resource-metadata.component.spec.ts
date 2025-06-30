import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewMetadataComponent } from './resource-metadata.component';

describe('OverviewMetadataComponent', () => {
  let component: OverviewMetadataComponent;
  let fixture: ComponentFixture<OverviewMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
