import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipes } from 'ng-mocks';

import { SafeHtmlPipe } from 'primeng/menu';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  FilterChipsComponent,
  ReusableFilterComponent,
  SearchHelpTutorialComponent,
  SearchInputComponent,
  SearchResultsContainerComponent,
} from '@shared/components';

import { InstitutionsSearchComponent } from './institutions-search.component';

describe.skip('InstitutionsSearchComponent', () => {
  let component: InstitutionsSearchComponent;
  let fixture: ComponentFixture<InstitutionsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InstitutionsSearchComponent,
        ...MockComponents(
          ReusableFilterComponent,
          SearchResultsContainerComponent,
          FilterChipsComponent,
          SearchHelpTutorialComponent,
          SearchInputComponent
        ),
        MockPipes(TranslatePipe, SafeHtmlPipe),
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
