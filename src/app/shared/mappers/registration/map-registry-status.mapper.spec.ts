import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { RegistrationAttributesJsonApi } from '@shared/models/registration/registration-json-api.model';

import { MapRegistryStatus } from './map-registry-status.mapper';

describe('MapRegistryStatus', () => {
  function attributes(overrides: Partial<RegistrationAttributesJsonApi>): RegistrationAttributesJsonApi {
    return overrides as RegistrationAttributesJsonApi;
  }

  it('should map a moderator-rejected registration to the rejected status', () => {
    const status = MapRegistryStatus(
      attributes({
        reviews_state: RegistrationReviewStates.Rejected,
        revision_state: 'moderator_rejected' as RevisionReviewStates,
      })
    );

    expect(status).toBe(RegistryStatus.Rejected);
  });

  it('should keep mapping an accepted registration to the accepted status', () => {
    const status = MapRegistryStatus(
      attributes({ reviews_state: RegistrationReviewStates.Accepted, revision_state: RevisionReviewStates.Approved })
    );
    expect(status).toBe(RegistryStatus.Accepted);
  });
});
