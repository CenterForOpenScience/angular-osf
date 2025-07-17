import { IncludedItem, IndexCard, InstitutionPreprint, InstitutionRegistrationsJsonApi, SearchResult } from '../models';

export function mapInstitutionPreprints(response: InstitutionRegistrationsJsonApi): InstitutionPreprint[] {
  if (!response.included) {
    return [];
  }

  const searchResults = response.included.filter(
    (item: IncludedItem): item is SearchResult => item.type === 'search-result'
  );
  const indexCards = response.included.filter((item: IncludedItem): item is IndexCard => item.type === 'index-card');

  const preprints: InstitutionPreprint[] = [];

  searchResults.forEach((result: SearchResult) => {
    const indexCardId = result.relationships?.indexCard?.data?.id;
    if (indexCardId) {
      const indexCard = indexCards.find((card: IndexCard) => card.id === indexCardId);
      if (indexCard && indexCard.attributes) {
        const metadata = indexCard.attributes.resourceMetadata;

        if (metadata) {
          preprints.push({
            id: metadata['@id'] || indexCard.id,
            title: metadata.title?.[0]?.['@value'] || '',
            link: metadata['@id'] || '',
            dateCreated: metadata.dateCreated?.[0]?.['@value'] || '',
            dateModified: metadata.dateModified?.[0]?.['@value'] || '',
            doi: metadata.identifier?.[0]?.['@value'] || '',
            contributorName: metadata.creator?.[0]?.name?.[0]?.['@value'] || '',
            license: metadata.rights?.[0]?.name?.[0]?.['@value'] || '',
            registrationSchema: metadata.subject?.[0]?.prefLabel?.[0]?.['@value'] || '',
          });
        }
      }
    }
  });

  return preprints;
}
