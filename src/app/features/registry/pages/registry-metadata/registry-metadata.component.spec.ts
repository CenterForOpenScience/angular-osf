import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryMetadataComponent } from './registry-metadata.component';

describe('RegistryMetadataComponent', () => {
  let component: RegistryMetadataComponent;
  let fixture: ComponentFixture<RegistryMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
