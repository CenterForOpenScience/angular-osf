import { ResourceType } from '@shared/enums';
import { IdName, Resource, SearchResourceMetadata } from '@shared/models';

export function MapResources(rawItem: SearchResourceMetadata): Resource {
  //TODO fix doi (identifiers) and check other fields
  return {
    id: rawItem['@id'],
    resourceType: ResourceType[rawItem?.resourceType[0]['@id'] as keyof typeof ResourceType],
    dateCreated: rawItem?.dateCreated?.[0]?.['@value'] ? new Date(rawItem?.dateCreated?.[0]?.['@value']) : undefined,
    dateModified: rawItem?.dateModified?.[0]?.['@value'] ? new Date(rawItem?.dateModified?.[0]?.['@value']) : undefined,
    creators: (rawItem?.creator ?? []).map(
      (creator) =>
        ({
          id: creator?.['@id'],
          name: creator?.name?.[0]?.['@value'],
        }) as IdName
    ),
    fileName: rawItem?.fileName?.[0]?.['@value'],
    title: rawItem?.title?.[0]?.['@value'] ?? rawItem?.name?.[0]?.['@value'],
    description: rawItem?.description?.[0]?.['@value'],
    from: {
      id: rawItem?.isPartOf?.[0]?.['@id'],
      name: rawItem?.isPartOf?.[0]?.title?.[0]?.['@value'],
    },
    license: {
      id: rawItem?.rights?.[0]?.['@id'],
      name: rawItem?.rights?.[0]?.name?.[0]?.['@value'],
    },
    provider: {
      id: rawItem?.publisher?.[0]?.['@id'],
      name: rawItem?.publisher?.[0]?.name?.[0]?.['@value'],
    },
    registrationTemplate: rawItem?.conformsTo?.[0]?.title?.[0]?.['@value'],
    identifier: rawItem?.identifier?.[0]?.['@value'],
    conflictOfInterestResponse: rawItem?.statedConflictOfInterest?.[0]?.['@id'],
    hasDataResource: !!rawItem?.hasDataResource,
    hasAnalyticCodeResource: !!rawItem?.hasAnalyticCodeResource,
    hasMaterialsResource: !!rawItem?.hasMaterialsResource,
    hasPapersResource: !!rawItem?.hasPapersResource,
    hasSupplementalResource: !!rawItem?.hasSupplementalResource,
  };
}
