import { TestBed } from '@angular/core/testing';

import { EnvironmentModel } from '@osf/shared/models/environment.model';

import { ENVIRONMENT } from './environment.provider';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Provider: Environment', () => {
  let environment: EnvironmentModel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OSFTestingModule],
    }).compileComponents();

    environment = TestBed.inject(ENVIRONMENT);
  });

  it('should allow updating a string value', () => {
    expect(environment.apiDomainUrl).toBe('http://localhost:8000');
    environment.apiDomainUrl = 'https://new-api.example.com';
    expect(environment.apiDomainUrl).toBe('https://new-api.example.com');
  });

  it('should allow updating a boolean value', () => {
    expect(environment.production).toBeFalsy();
    environment.production = true;
    expect(environment.production).toBeTruthy();
  });

  it('should allow updating a nullable value', () => {
    environment.dataciteTrackerRepoId = 'new-repo-id';
    expect(environment.dataciteTrackerRepoId).toBe('new-repo-id');

    environment.dataciteTrackerRepoId = null;
    expect(environment.dataciteTrackerRepoId).toBeNull();
  });

  it('should allow updating an optional nested object', () => {
    environment.activityLogs = { pageSize: 100 };
    expect(environment.activityLogs).toEqual({ pageSize: 100 });
    environment.activityLogs.pageSize = 200;
    expect(environment.activityLogs).toEqual({ pageSize: 200 });
    expect(environment.activityLogs.pageSize).toBe(200);
  });

  it('should reflect changes in subsequent reads', () => {
    environment.facebookAppId = 'abc123';
    expect(environment.facebookAppId).toBe('abc123');

    environment.facebookAppId = 'xyz999';
    expect(environment.facebookAppId).toBe('xyz999');
  });

  it('should support type-safe key/value updates through keyof', () => {
    const key: keyof EnvironmentModel = 'supportEmail';
    const newValue = 'support@newdomain.com';

    environment[key] = newValue;
    expect(environment.supportEmail).toBe(newValue);
  });
});
