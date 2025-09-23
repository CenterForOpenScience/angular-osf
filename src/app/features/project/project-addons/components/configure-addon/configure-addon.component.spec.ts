import { provideStore } from '@ngxs/store';

import { MessageService } from 'primeng/api';

import { of } from 'rxjs';

import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { AddonsState } from '@osf/shared/stores';

import { ConfigureAddonComponent } from './configure-addon.component';

import { getConfiguredAddonsData } from '@testing/data/addons/addons.configured.data';
import { getAddonsOperationInvocation } from '@testing/data/addons/addons.operation-invocation.data';
import { ToastServiceMock } from '@testing/mocks/toast.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { environment } from 'src/environments/environment';

describe.skip('Component: Configure Addon', () => {
  let component: ConfigureAddonComponent;
  let fixture: ComponentFixture<ConfigureAddonComponent>;

  const mockActivatedRoute = {
    parent: {
      parent: {
        snapshot: {
          params: {
            id: 'mocked-id',
          },
        },
      },
    },
    snapshot: {
      paramMap: new Map(),
      queryParamMap: new Map(),
      data: {},
    },
    paramMap: of(new Map()),
    queryParamMap: of(new Map()),
    // ... if you use `route.root`, add a dummy root too
    root: {},
  };

  describe('addon present', () => {
    beforeEach(async () => {
      const mockRouter = {
        url: '/project/abc123/addons/configure', // mock the actual URL used in your component
        navigate: jest.fn(),
        getCurrentNavigation: jest.fn().mockReturnValue({
          extras: {
            state: {
              addon: getConfiguredAddonsData(0),
            },
          },
        }),
      } as unknown as Router;

      await TestBed.configureTestingModule({
        imports: [OSFTestingModule, ConfigureAddonComponent],
        providers: [
          provideStore([AddonsState]),
          ToastServiceMock,
          MessageService,
          { provide: Router, useValue: mockRouter },
          {
            provide: ActivatedRoute,
            useValue: mockActivatedRoute,
          },
          {
            provide: 'ENVIRONMENT',
            useValue: environment.webUrl,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfigureAddonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should validate the constuctor values', () => {
      expect(component.storageAddon()).toBeNull();
      expect(component.addon()).toEqual(
        Object({
          attributes: {
            connected_capabilities: ['ACCESS', 'UPDATE'],
            connected_operation_names: ['list_child_items', 'list_root_items', 'get_item_info'],
            current_user_is_owner: true,
            display_name: 'Google Drive',
            external_service_name: 'googledrive',
            root_folder: '0AIl0aR4C9JAFUk9PVA',
          },
          id: '756579dc-3a24-4849-8866-698a60846ac3',
          links: expect.any(Object),
          relationships: expect.any(Object),
          type: 'configured-storage-addons',
        })
      );

      expect(component.baseUrl()).toBe('/project/abc123');
      expect(component.resourceUri()).toBe('https://staging4.osf.io/mocked-id');
      expect(component.addonTypeString()).toBe('storage');
      expect(component.selectedStorageItemId).toBeDefined();
      expect(component.accountNameControl.value).toBeUndefined();
      expect(component.isGoogleDrive()).toBeFalsy();
    });

    it('should valid onInit - action called', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const request = httpMock.expectOne('http://addons.localhost:8000/addon-operation-invocations/');
      expect(request.request.method).toBe('POST');
      request.flush(getAddonsOperationInvocation());

      expect(component.operationInvocation()).toEqual(
        Object({
          id: '022c80d6-06b5-452d-9932-19bb135cd5c2',
          invocationStatus: 'SUCCESS',
          itemCount: 0,
          operationKwargs: {
            itemId: '0AIl0aR4C9JAFUk9PVA',
            itemType: undefined,
          },
          operationName: 'get_item_info',
          operationResult: [
            {
              canBeRoot: true,
              itemId: '0AIl0aR4C9JAFUk9PVA',
              itemName: 'My Drive',
              itemType: 'FOLDER',
              mayContainRootCandidates: true,
            },
          ],
          type: 'addon-operation-invocations',
        })
      );
      expect(httpMock.verify).toBeTruthy();
    }));
  });

  describe('addon not-present', () => {
    beforeEach(async () => {
      const mockRouter = {
        url: '/project/abc123/addons/configure', // mock the actual URL used in your component
        navigate: jest.fn(),
        getCurrentNavigation: jest.fn().mockReturnValue({
          extras: {
            state: {
              addon: null,
            },
          },
        }),
      } as unknown as Router;

      await TestBed.configureTestingModule({
        imports: [OSFTestingModule, ConfigureAddonComponent],
        providers: [
          provideStore([AddonsState]),
          ToastServiceMock,
          { provide: Router, useValue: mockRouter },
          {
            provide: ActivatedRoute,
            useValue: mockActivatedRoute,
          },
          {
            provide: 'ENVIRONMENT',
            useValue: environment,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfigureAddonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should validate user is redirected', () => {
      const spy = jest.spyOn(component['router'], 'navigate');
      expect(spy).toHaveBeenCalledWith(['/project/abc123/addons']);
    });

    it('should valid onInit - action not called', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      httpMock.expectNone('http://addons.localhost:8000/addon-operation-invocations/');

      expect(httpMock.verify).toBeTruthy();
    }));
  });
});
