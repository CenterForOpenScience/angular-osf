import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/factory/environment.factory';
import { ConfigModel } from '@core/models/config.model';
import { EnvironmentModel } from '@osf/shared/models/environment.model';

import { OSFConfigService } from './osf-config.service';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Service: Config', () => {
  let service: OSFConfigService;
  let httpMock: HttpTestingController;
  let environment: EnvironmentModel;

  const mockConfig: ConfigModel = {
    apiDomainUrl: 'https://api.example.com',
    production: true,
  } as any; // Cast to any if index signature isn’t added

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [OSFTestingModule],
      providers: [OSFConfigService],
    }).compileComponents();

    service = TestBed.inject(OSFConfigService);
    httpMock = TestBed.inject(HttpTestingController);
    environment = TestBed.inject(ENVIRONMENT);
  });

  it('should return a value with get()', async () => {
    let loadPromise = service.load();
    const request = httpMock.expectOne('/assets/config/config.json');
    request.flush(mockConfig);
    await loadPromise;
    expect(environment.apiDomainUrl).toBe('https://api.example.com');
    expect(environment.production).toBeTruthy();
    loadPromise = service.load();
    await loadPromise;

    expect(environment.apiDomainUrl).toBe('https://api.example.com');
    expect(environment.production).toBeTruthy();

    expect(httpMock.verify()).toBeUndefined();
  });

  it('should return a value with ahs()', async () => {
    let loadPromise = service.load();
    const request = httpMock.expectOne('/assets/config/config.json');
    request.flush(mockConfig);
    await loadPromise;
    expect(environment.apiDomainUrl).toBe('https://api.example.com');
    expect(environment.production).toBeTruthy();

    loadPromise = service.load();
    await loadPromise;
    expect(environment.apiDomainUrl).toBe('https://api.example.com');
    expect(environment.production).toBeTruthy();

    expect(httpMock.verify()).toBeUndefined();
  });
});
