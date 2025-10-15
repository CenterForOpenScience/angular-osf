import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationAddonCardComponent } from './citation-addon-card.component';

describe.skip('CitationAddonCardComponent', () => {
  let component: CitationAddonCardComponent;
  let fixture: ComponentFixture<CitationAddonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationAddonCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationAddonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
