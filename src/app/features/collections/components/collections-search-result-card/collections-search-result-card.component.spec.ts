import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipes } from 'ng-mocks';

import { DatePipe } from '@angular/common';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components';

import { CollectionsSearchResultCardComponent } from './collections-search-result-card.component';

describe('CollectionsResultCardComponent', () => {
  let component: CollectionsSearchResultCardComponent;
  let componentRef: ComponentRef<CollectionsSearchResultCardComponent>;
  let fixture: ComponentFixture<CollectionsSearchResultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CollectionsSearchResultCardComponent,
        MockPipes(TranslatePipe, DatePipe),
        MockComponent(ContributorsListComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsSearchResultCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('cardItem', {});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
