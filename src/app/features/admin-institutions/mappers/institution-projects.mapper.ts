import {
  Affiliation,
  IncludedItem,
  IndexCard,
  InstitutionProject,
  InstitutionRegistrationsJsonApi,
  SearchResult,
} from '../models';

export function mapInstitutionProjects(response: InstitutionRegistrationsJsonApi): InstitutionProject[] {
  if (!response.included) {
    return [];
  }

  const searchResults = response.included.filter(
    (item: IncludedItem): item is SearchResult => item.type === 'search-result'
  );
  const indexCards = response.included.filter((item: IncludedItem): item is IndexCard => item.type === 'index-card');
  const projects: InstitutionProject[] = [];

  searchResults.forEach((result: SearchResult) => {
    const indexCardId = result.relationships?.indexCard?.data?.id;

    if (indexCardId) {
      const indexCard = indexCards.find((card: IndexCard) => card.id === indexCardId);

      if (indexCard && indexCard.attributes) {
        const metadata = indexCard.attributes.resourceMetadata;

        if (metadata) {
          projects.push({
            id: metadata['@id'] || indexCard.id,
            title: metadata.title?.[0]?.['@value'] || '',
            creator: {
              id: metadata.creator?.[0]?.['@id'] || '',
              name: metadata.creator?.[0]?.name?.[0]?.['@value'] || '',
            },
            dateCreated: metadata.dateCreated?.[0]?.['@value'] || '',
            dateModified: metadata.dateModified?.[0]?.['@value'] || '',
            resourceType: metadata.resourceType?.[0]?.['@id'] || '',
            accessService: metadata.accessService?.[0]?.['@id'] || '',
            publisher: metadata.publisher?.[0]?.name?.[0]?.['@value'] || '',
            identifier: metadata.identifier?.[0]?.['@value'] || '',
            storageByteCount: metadata.storageByteCount?.[0]?.['@value']
              ? parseInt(metadata.storageByteCount[0]['@value'])
              : undefined,
            storageRegion: metadata.storageRegion?.[0]?.prefLabel?.[0]?.['@value'] || undefined,
            affiliation:
              metadata.affiliation
                ?.map((aff: Affiliation) => aff.name?.[0]?.['@value'])
                .filter((value): value is string => Boolean(value)) || [],
            description: metadata.description?.[0]?.['@value'] || undefined,
            rights: metadata.rights?.[0]?.name?.[0]?.['@value'] || undefined,
            subject: metadata.subject?.[0]?.prefLabel?.[0]?.['@value'] || undefined,
            viewCount: metadata.usage?.[0]?.viewCount?.[0]?.['@value']
              ? parseInt(metadata.usage[0].viewCount[0]['@value'])
              : undefined,
            downloadCount: metadata.usage?.[0]?.downloadCount?.[0]?.['@value']
              ? parseInt(metadata.usage[0].downloadCount[0]['@value'])
              : undefined,
            hasVersion: metadata.hasVersion ? metadata.hasVersion.length > 0 : false,
            supplements: metadata.supplements ? metadata.supplements.length > 0 : false,
          });
        }
      }
    }
  });

  return projects;
}
