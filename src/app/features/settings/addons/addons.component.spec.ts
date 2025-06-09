import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@osf/core/store/user';
import { SearchInputComponent, SubHeaderComponent } from '@osf/shared/components';
import { IS_XSMALL } from '@osf/shared/utils';
import { AddonCardListComponent } from '@shared/components/addons';
import { AddonsSelectors } from '@shared/stores/addons';

import { AddonsComponent } from './addons.component';

describe('AddonsComponent', () => {
  let component: AddonsComponent;
  let fixture: ComponentFixture<AddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonsComponent, ...MockComponents(SubHeaderComponent, SearchInputComponent, AddonCardListComponent)],
      providers: [
        MockProvider(Store, {
          selectSignal: jest.fn().mockImplementation((selector) => {
            if (selector === UserSelectors.getCurrentUser) {
              return () => ({ id: 'test-user-id' });
            }
            if (selector === AddonsSelectors.getAddonsUserReference) {
              return () => [{ id: 'test-reference-id' }];
            }
            if (selector === AddonsSelectors.getStorageAddons) {
              return () => [];
            }
            if (selector === AddonsSelectors.getCitationAddons) {
              return () => [];
            }
            if (selector === AddonsSelectors.getAuthorizedStorageAddons) {
              return () => [];
            }
            if (selector === AddonsSelectors.getAuthorizedCitationAddons) {
              return () => [];
            }
            return () => null;
          }),
          dispatch: jest.fn(),
        }),
        MockProvider(IS_XSMALL, of(false)),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
