import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { IconComponent, SearchInputComponent } from '@shared/components';

import { HomeComponent } from './home.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [HomeComponent, OSFTestingModule, ...MockComponents(SearchInputComponent, IconComponent)],
      providers: [MockProvider(Router, routerMock), MockProvider(ActivatedRoute, activatedRouteMock)],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to search page with empty string when redirectToSearchPageWithValue is called with no value', () => {
    component.redirectToSearchPageWithValue();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { search: '' },
    });
  });

  it('should navigate to search page with search value when searchControl has a value', () => {
    const searchValue = 'test search query';
    component.searchControl.setValue(searchValue);

    component.redirectToSearchPageWithValue();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { search: searchValue },
    });
  });

  it('should navigate to search page with null when searchControl is set to null', () => {
    component.searchControl.setValue(null);

    component.redirectToSearchPageWithValue();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { search: null },
    });
  });
});
