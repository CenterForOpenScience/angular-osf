import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SearchInputComponent } from '../../search-input/search-input.component';
import { SelectComponent } from '../../select/select.component';

import { AddonsToolbarComponent } from './addons-toolbar.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

describe('AddonsToolbarComponent', () => {
  let component: AddonsToolbarComponent;
  let fixture: ComponentFixture<AddonsToolbarComponent>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    activatedRouteMock = ActivatedRouteMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [AddonsToolbarComponent, OSFTestingModule, ...MockComponents(SearchInputComponent, SelectComponent)],
      providers: [MockProvider(ActivatedRoute, activatedRouteMock)],
    }).compileComponents();

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
