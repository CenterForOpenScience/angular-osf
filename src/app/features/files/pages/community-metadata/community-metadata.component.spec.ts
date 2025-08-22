import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityMetadataComponent } from './community-metadata.component';

describe('CommunityMetadataComponent', () => {
  let component: CommunityMetadataComponent;
  let fixture: ComponentFixture<CommunityMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
