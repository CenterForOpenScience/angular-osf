import { firstValueFrom } from 'rxjs';

import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { provideOSFHttp } from '@testing/osf.testing.provider';
import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';

import { RegistriesService } from './registries.service';

describe('RegistriesService', () => {
  let service: RegistriesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockEnvironment(), provideOSFHttp()],
    });
    service = TestBed.inject(RegistriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it.each([
    { provider: 'osf', schema: 'open-ended', projectId: undefined },
    { provider: 'branded-registry', schema: 'branded-template', projectId: 'project-1' },
  ])(
    'sends acceptable use confirmation when creating a draft for $provider',
    async ({ provider, schema, projectId }) => {
      const result = firstValueFrom(service.createDraft(schema, provider, true, projectId));
      const request = httpMock.expectOne({ method: 'POST', url: `${MOCK_API_URL}/draft_registrations/` });

      expect(request.request.body).toEqual({
        data: {
          type: 'draft_registrations',
          attributes: { acceptable_use_confirmed: true },
          relationships: {
            branched_from: projectId ? { data: { type: 'nodes', id: projectId } } : undefined,
            registration_schema: { data: { type: 'registration-schemas', id: schema } },
            provider: { data: { type: 'registration-providers', id: provider } },
          },
        },
      });

      request.flush(
        { data: { id: 'draft-1', attributes: {}, relationships: {} } },
        { status: 201, statusText: 'Created' }
      );
      expect((await result).id).toBe('draft-1');
    }
  );
});
