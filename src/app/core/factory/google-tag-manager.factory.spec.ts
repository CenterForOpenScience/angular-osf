import { TestBed } from '@angular/core/testing';

import { OSFConfigService } from '@core/services/osf-config.service';

import { GOOGLE_TAG_MANAGER_ID, GOOGLE_TAG_MANAGER_ID_PROVIDER } from './google-tag-manager.factory';

describe('factory: google tag manager', () => {
  const mockGtmId = 'GTM-TEST123';

  let configServiceMock: jest.Mocked<OSFConfigService>;

  beforeEach(async () => {
    configServiceMock = {
      get: jest.fn().mockResolvedValue(mockGtmId),
    } as unknown as jest.Mocked<OSFConfigService>;

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: OSFConfigService,
          useValue: configServiceMock,
        },
        GOOGLE_TAG_MANAGER_ID_PROVIDER,
      ],
    }).compileComponents();
  });

  it('should return the GTM ID from the config service', async () => {
    const gtmId = await TestBed.inject(GOOGLE_TAG_MANAGER_ID);
    expect(gtmId).toBe(mockGtmId);
    expect(configServiceMock.get).toHaveBeenCalledWith('googleTagManagerId');
  });
});
