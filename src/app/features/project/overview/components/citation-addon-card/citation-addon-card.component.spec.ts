import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationCollectionItemComponent } from '../citation-collection-item/citation-collection-item.component';
import { CitationItemComponent } from '../citation-item/citation-item.component';

import { CitationAddonCardComponent } from './citation-addon-card.component';

describe.skip('CitationAddonCardComponent', () => {
  let component: CitationAddonCardComponent;
  let fixture: ComponentFixture<CitationAddonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationAddonCardComponent, ...MockComponents(CitationItemComponent, CitationCollectionItemComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationAddonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
