import { provideStore, Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of, Subject, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { RegistryResourceType } from '@osf/shared/enums/registry-resource.enum';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';

import { RegistryResource } from '../../models';
import { RegistryResourcesService } from '../../services';

import {
  ConfirmAddRegistryResource,
  DeleteResource,
  GetRegistryResources,
  UpdateResource,
} from './registry-resources.actions';
import { RegistryResourcesSelectors } from './registry-resources.selectors';
import { RegistryResourcesState } from './registry-resources.state';

const MOCK_RESOURCE: RegistryResource = {
  id: 'res-1',
  description: 'Test resource',
  finalized: true,
  type: RegistryResourceType.Data,
  pid: '10.123/test',
};

const MOCK_PAGINATED_RESOURCES: PaginatedData<RegistryResource[]> = {
  data: [MOCK_RESOURCE],
  totalCount: 21,
  pageSize: 10,
};

describe('RegistryResourcesState', () => {
  let store: Store;
  let getResourcesMock: ReturnType<typeof vi.fn<RegistryResourcesService['getResources']>>;
  let deleteResourceMock: ReturnType<typeof vi.fn<RegistryResourcesService['deleteResource']>>;
  let confirmAddingResourceMock: ReturnType<typeof vi.fn<RegistryResourcesService['confirmAddingResource']>>;
  let updateResourceMock: ReturnType<typeof vi.fn<RegistryResourcesService['updateResource']>>;

  beforeEach(() => {
    getResourcesMock = vi.fn<RegistryResourcesService['getResources']>().mockReturnValue(of(MOCK_PAGINATED_RESOURCES));
    deleteResourceMock = vi.fn<RegistryResourcesService['deleteResource']>().mockReturnValue(of(undefined));
    confirmAddingResourceMock = vi
      .fn<RegistryResourcesService['confirmAddingResource']>()
      .mockReturnValue(of(MOCK_RESOURCE));
    updateResourceMock = vi.fn<RegistryResourcesService['updateResource']>().mockReturnValue(of(undefined));

    const mockService: Pick<
      RegistryResourcesService,
      'getResources' | 'deleteResource' | 'confirmAddingResource' | 'updateResource'
    > = {
      getResources: getResourcesMock,
      deleteResource: deleteResourceMock,
      confirmAddingResource: confirmAddingResourceMock,
      updateResource: updateResourceMock,
    };

    TestBed.configureTestingModule({
      providers: [provideStore([RegistryResourcesState]), MockProvider(RegistryResourcesService, mockService)],
    });

    store = TestBed.inject(Store);
  });

  it('should fetch resources for a page and update total count', async () => {
    const subject = new Subject<PaginatedData<RegistryResource[]>>();
    getResourcesMock.mockReturnValue(subject.asObservable());

    const dispatchPromise = firstValueFrom(store.dispatch(new GetRegistryResources('reg-1', 2)));

    expect(store.selectSnapshot(RegistryResourcesSelectors.isResourcesLoading)).toBe(true);
    expect(getResourcesMock).toHaveBeenCalledWith('reg-1', 2);

    subject.next(MOCK_PAGINATED_RESOURCES);
    subject.complete();
    await dispatchPromise;

    expect(store.selectSnapshot(RegistryResourcesSelectors.getResources)).toEqual([MOCK_RESOURCE]);
    expect(store.selectSnapshot(RegistryResourcesSelectors.getResourcesTotalCount)).toBe(21);
    expect(store.selectSnapshot(RegistryResourcesSelectors.isResourcesLoading)).toBe(false);
    expect(store.snapshot().registryResources.currentPage).toBe(2);
  });

  it('should handle get resources error', async () => {
    getResourcesMock.mockReturnValue(throwError(() => new Error('Failed to fetch resources')));

    await expect(firstValueFrom(store.dispatch(new GetRegistryResources('reg-1', 1)))).rejects.toThrow(
      'Failed to fetch resources'
    );

    const snapshot = store.snapshot().registryResources.resources;
    expect(snapshot.data).toBeNull();
    expect(snapshot.error).toBe('Failed to fetch resources');
    expect(snapshot.isLoading).toBe(false);
  });

  it('should refetch the first page after delete', async () => {
    await firstValueFrom(store.dispatch(new DeleteResource('res-1', 'reg-1')));

    expect(deleteResourceMock).toHaveBeenCalledWith('res-1');
    expect(getResourcesMock).toHaveBeenCalledWith('reg-1', 1);
  });

  it('should refetch the first page after confirm add', async () => {
    await firstValueFrom(store.dispatch(new ConfirmAddRegistryResource({ finalized: true }, 'res-1', 'reg-1')));

    expect(confirmAddingResourceMock).toHaveBeenCalledWith('res-1', { finalized: true });
    expect(getResourcesMock).toHaveBeenCalledWith('reg-1', 1);
  });

  it('should refetch the current page after update', async () => {
    await firstValueFrom(store.dispatch(new GetRegistryResources('reg-1', 3)));
    getResourcesMock.mockClear();

    await firstValueFrom(
      store.dispatch(
        new UpdateResource('reg-1', 'res-1', {
          pid: '10.123/updated',
          resource_type: RegistryResourceType.Data,
        })
      )
    );

    expect(updateResourceMock).toHaveBeenCalled();
    expect(getResourcesMock).toHaveBeenCalledWith('reg-1', 3);
  });
});
