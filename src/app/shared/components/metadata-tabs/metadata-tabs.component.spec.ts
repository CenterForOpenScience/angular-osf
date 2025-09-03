import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataTabsComponent } from './metadata-tabs.component';

describe.skip('MetadataTabsComponent', () => {
  let component: MetadataTabsComponent;
  let fixture: ComponentFixture<MetadataTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
