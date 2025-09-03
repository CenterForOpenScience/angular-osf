import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintSecondaryMetadataComponent } from './preprint-secondary-metadata.component';

describe.skip('PreprintSecondaryMetadataComponent', () => {
  let component: PreprintSecondaryMetadataComponent;
  let fixture: ComponentFixture<PreprintSecondaryMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintSecondaryMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintSecondaryMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
