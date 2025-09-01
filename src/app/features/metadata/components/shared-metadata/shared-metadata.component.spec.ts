import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMetadataComponent } from './shared-metadata.component';

describe('SharedMetadataComponent', () => {
  let component: SharedMetadataComponent;
  let fixture: ComponentFixture<SharedMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
