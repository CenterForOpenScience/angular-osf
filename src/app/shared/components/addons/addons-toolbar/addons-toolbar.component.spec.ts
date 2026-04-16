import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

import { SearchInputComponent } from '../../search-input/search-input.component';
import { SelectComponent } from '../../select/select.component';

import { AddonsToolbarComponent } from './addons-toolbar.component';

describe('AddonsToolbarComponent', () => {
  let component: AddonsToolbarComponent;
  let fixture: ComponentFixture<AddonsToolbarComponent>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(() => {
    activatedRouteMock = ActivatedRouteMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [AddonsToolbarComponent, ...MockComponents(SearchInputComponent, SelectComponent)],
      providers: [provideOSFCore(), MockProvider(ActivatedRoute, activatedRouteMock)],
    });

    fixture = TestBed.createComponent(AddonsToolbarComponent);
    fixture.componentRef.setInput('categoryOptions', []);
    fixture.componentRef.setInput('searchControl', new FormControl(''));
    fixture.componentRef.setInput('selectedCategory', '');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
