import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigModel } from '@core/models/config.model';

import { OSFConfigService } from './osf-config.service';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Service: Config', () => {
  let service: OSFConfigService;
  let httpMock: HttpTestingController;

  const mockConfig: ConfigModel = {
    apiUrl: 'https://api.example.com',
    environment: 'staging',
    featureToggle: true,
    customKey: 'customValue',
  } as any; // Cast to any if index signature isn’t added

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [OSFTestingModule],
      providers: [OSFConfigService],
    }).compileComponents();

    service = TestBed.inject(OSFConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should return a value with get()', async () => {
    let loadPromise = service.load();
    const request = httpMock.expectOne('/assets/config/config.json');
    request.flush(mockConfig);
    await loadPromise;
    expect(service.get('apiUrl')).toBe('https://api.example.com');
    expect(service.get('featureToggle')).toBe(true);
    loadPromise = service.load();
    await loadPromise;
    expect(service.get('nonexistentKey')).toBeNull();

    expect(httpMock.verify()).toBeUndefined();
  });

  it('should return a value with ahs()', async () => {
    let loadPromise = service.load();
    const request = httpMock.expectOne('/assets/config/config.json');
    request.flush(mockConfig);
    await loadPromise;
    expect(service.has('apiUrl')).toBeTruthy();
    expect(service.has('featureToggle')).toBeTruthy();
    loadPromise = service.load();
    await loadPromise;
    expect(service.has('nonexistentKey')).toBeFalsy();

    expect(httpMock.verify()).toBeUndefined();
  });
});
