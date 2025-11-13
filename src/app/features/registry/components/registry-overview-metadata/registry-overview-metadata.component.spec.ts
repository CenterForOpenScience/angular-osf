import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryOverviewMetadataComponent } from './registry-overview-metadata.component';

describe('RegistryOverviewMetadataComponent', () => {
  let component: RegistryOverviewMetadataComponent;
  let fixture: ComponentFixture<RegistryOverviewMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryOverviewMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryOverviewMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
