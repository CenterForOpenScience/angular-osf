import { ResourceType } from '@shared/enums';
import { IndexCardDataJsonApi, ResourceModel } from '@shared/models';

export function MapResources(indexCardData: IndexCardDataJsonApi): ResourceModel {
  const resourceMetadata = indexCardData.attributes.resourceMetadata;
  const resourceIdentifier = indexCardData.attributes.resourceIdentifier;
  return {
    absoluteUrl: resourceMetadata['@id'],
    resourceType: ResourceType[resourceMetadata.resourceType[0]['@id'] as keyof typeof ResourceType],
    name: resourceMetadata.name?.[0]?.['@value'],
    title: resourceMetadata.title?.[0]?.['@value'],
    fileName: resourceMetadata.fileName?.[0]?.['@value'],
    description: resourceMetadata.description?.[0]?.['@value'],

    dateCreated: resourceMetadata.dateCreated?.[0]?.['@value']
      ? new Date(resourceMetadata.dateCreated?.[0]?.['@value'])
      : undefined,
    dateModified: resourceMetadata.dateModified?.[0]?.['@value']
      ? new Date(resourceMetadata.dateModified?.[0]?.['@value'])
      : undefined,
    dateWithdrawn: resourceMetadata.dateWithdrawn?.[0]?.['@value']
      ? new Date(resourceMetadata.dateWithdrawn?.[0]?.['@value'])
      : undefined,
    language: resourceMetadata.language?.[0]?.['@value'],
    doi: resourceIdentifier.filter((id) => id.includes('https://doi.org')),
    creators: (resourceMetadata.creator ?? []).map((creator) => ({
      absoluteUrl: creator?.['@id'],
      name: creator?.name?.[0]?.['@value'],
    })),
    affiliations: (resourceMetadata.affiliation ?? []).map((affiliation) => ({
      absoluteUrl: affiliation?.['@id'],
      name: affiliation?.name?.[0]?.['@value'],
    })),
    resourceNature: (resourceMetadata.resourceNature ?? null)?.map((r) => r?.displayLabel?.[0]?.['@value'])?.[0],
    qualifiedAttribution: (resourceMetadata.qualifiedAttribution ?? []).map((qualifiedAttribution) => ({
      agentId: qualifiedAttribution?.agent?.[0]?.['@id'],
      order: +qualifiedAttribution?.['osf:order']?.[0]?.['@value'],
    })),
    identifiers: (resourceMetadata.identifier ?? []).map((obj) => obj['@value']),
    provider: (resourceMetadata.publisher ?? null)?.map((publisher) => ({
      absoluteUrl: publisher?.['@id'],
      name: publisher.name?.[0]?.['@value'],
    }))[0],
    isPartOfCollection: (resourceMetadata.isPartOfCollection ?? null)?.map((partOfCollection) => ({
      absoluteUrl: partOfCollection?.['@id'],
      name: partOfCollection.title?.[0]?.['@value'],
    }))[0],
    storageByteCount: resourceMetadata.storageByteCount?.[0]?.['@value'],
    storageRegion: resourceMetadata.storageRegion?.[0]?.prefLabel?.[0]?.['@value'],
    viewsCount: resourceMetadata.usage?.viewCount?.[0]?.['@value'],
    downloadCount: resourceMetadata.usage?.downloadCount?.[0]?.['@value'],
    addons: (resourceMetadata.hasOsfAddon ?? null)?.map((addon) => addon.prefLabel?.[0]?.['@value']),
    license: (resourceMetadata.rights ?? null)?.map((part) => ({
      absoluteUrl: part?.['@id'],
      name: part.name?.[0]?.['@value'],
    }))[0],
    funders: (resourceMetadata.funder ?? []).map((funder) => ({
      absoluteUrl: funder?.['@id'],
      name: funder?.name?.[0]?.['@value'],
    })),
    isPartOf: (resourceMetadata.isPartOf ?? null)?.map((part) => ({
      absoluteUrl: part?.['@id'],
      name: part.title?.[0]?.['@value'],
    }))[0],
    isContainedBy: (resourceMetadata.isContainedBy ?? null)?.map((isContainedBy) => ({
      absoluteUrl: isContainedBy?.['@id'],
      name: isContainedBy?.title?.[0]?.['@value'],
      funders: (isContainedBy?.funder ?? []).map((funder) => ({
        absoluteUrl: funder?.['@id'],
        name: funder?.name?.[0]?.['@value'],
      })),
      license: (isContainedBy?.rights ?? null)?.map((part) => ({
        absoluteUrl: part?.['@id'],
        name: part.name?.[0]?.['@value'],
      }))[0],
      creators: (isContainedBy?.creator ?? []).map((creator) => ({
        absoluteUrl: creator?.['@id'],
        name: creator?.name?.[0]?.['@value'],
      })),
      qualifiedAttribution: (isContainedBy?.qualifiedAttribution ?? []).map((qualifiedAttribution) => ({
        agentId: qualifiedAttribution?.agent?.[0]?.['@id'],
        order: +qualifiedAttribution?.['osf:order']?.[0]?.['@value'],
      })),
    }))[0],
    statedConflictOfInterest: resourceMetadata.statedConflictOfInterest?.[0]?.['@value'],
    registrationTemplate: resourceMetadata.conformsTo?.[0]?.title?.[0]?.['@value'],
    hasPreregisteredAnalysisPlan: resourceMetadata.hasPreregisteredAnalysisPlan?.[0]?.['@id'],
    hasPreregisteredStudyDesign: resourceMetadata.hasPreregisteredStudyDesign?.[0]?.['@id'],
    hasDataResource: resourceMetadata.hasDataResource?.[0]?.['@id'],
    hasAnalyticCodeResource: !!resourceMetadata.hasAnalyticCodeResource,
    hasMaterialsResource: !!resourceMetadata.hasMaterialsResource,
    hasPapersResource: !!resourceMetadata.hasPapersResource,
    hasSupplementalResource: !!resourceMetadata.hasSupplementalResource,
  };
}
