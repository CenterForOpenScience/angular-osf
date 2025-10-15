import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from '@shared/components';
import { StorageItemType } from '@shared/enums';
import { AddonOperationInvocationService, AddonsService } from '@shared/services';

import { CitationItemComponent } from '../citation-item/citation-item.component';

import { CitationCollectionItemComponent } from './citation-collection-item.component';

describe.skip('CitationCollectionItemComponent', () => {
  let component: CitationCollectionItemComponent;
  let fixture: ComponentFixture<CitationCollectionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationCollectionItemComponent, ...MockComponents(IconComponent, CitationItemComponent)],
      providers: [MockProvider(AddonOperationInvocationService), MockProvider(AddonsService)],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationCollectionItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('addon', {
      id: '1',
      name: 'Test Addon',
    } as any);
    fixture.componentRef.setInput('collection', {
      itemId: '1',
      itemName: 'Test Collection',
      itemType: StorageItemType.Collection,
    } as any);
    fixture.componentRef.setInput('selectedCitationStyle', 'apa');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
