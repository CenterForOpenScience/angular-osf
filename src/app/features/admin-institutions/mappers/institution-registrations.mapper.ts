import {
  Affiliation,
  IncludedItem,
  IndexCard,
  InstitutionRegistration,
  InstitutionRegistrationsJsonApi,
  SearchResult,
} from '../models';

export function mapInstitutionRegistrations(response: InstitutionRegistrationsJsonApi): InstitutionRegistration[] {
  if (!response.included) {
    return [];
  }

  const searchResults = response.included.filter(
    (item: IncludedItem): item is SearchResult => item.type === 'search-result'
  );
  const indexCards = response.included.filter((item: IncludedItem): item is IndexCard => item.type === 'index-card');
  const registrations: InstitutionRegistration[] = [];

  searchResults.forEach((result: SearchResult) => {
    const indexCardId = result.relationships?.indexCard?.data?.id;
    if (indexCardId) {
      const indexCard = indexCards.find((card: IndexCard) => card.id === indexCardId);
      if (indexCard && indexCard.attributes) {
        const metadata = indexCard.attributes.resourceMetadata;

        if (metadata) {
          registrations.push({
            id: metadata['@id'] || indexCard.id,
            title: metadata.title?.[0]?.['@value'] || '',
            link: metadata['@id'] || '',
            dateCreated: metadata.dateCreated?.[0]?.['@value'] || '',
            dateModified: metadata.dateModified?.[0]?.['@value'] || '',
            doi: metadata.identifier?.[0]?.['@value'] || '',
            storageLocation: metadata.storageRegion?.[0]?.prefLabel?.[0]?.['@value'] || '',
            totalDataStored: metadata.storageByteCount?.[0]?.['@value'] || '',
            contributorName: metadata.creator?.[0]?.name?.[0]?.['@value'] || '',
            views: metadata.usage?.[0]?.viewCount?.[0]?.['@value']
              ? parseInt(metadata.usage[0].viewCount[0]['@value'])
              : undefined,
            resourceType: metadata.resourceType?.[0]?.['@id'] || '',
            license: metadata.rights?.[0]?.name?.[0]?.['@value'] || '',
            funderName:
              metadata.affiliation
                ?.map((aff: Affiliation) => aff.name?.[0]?.['@value'])
                .filter((value): value is string => Boolean(value))
                .join(', ') || '',
            registrationSchema: metadata.subject?.[0]?.prefLabel?.[0]?.['@value'] || '',
          });
        }
      }
    }
  });

  return registrations;
}
