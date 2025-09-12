import structuredClone from 'structured-clone';

const ResourceReferences = {
  data: [
    {
      type: 'resource-references',
      id: '3193f97c-e6d8-41a4-8312-b73483442086',
      attributes: {
        resource_uri: 'https://staging4.osf.io/xgrm4',
      },
      relationships: {
        configured_storage_addons: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/resource-references/3193f97c-e6d8-41a4-8312-b73483442086/configured_storage_addons',
          },
        },
        configured_link_addons: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/resource-references/3193f97c-e6d8-41a4-8312-b73483442086/configured_link_addons',
          },
        },
        configured_citation_addons: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/resource-references/3193f97c-e6d8-41a4-8312-b73483442086/configured_citation_addons',
          },
        },
        configured_computing_addons: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/resource-references/3193f97c-e6d8-41a4-8312-b73483442086/configured_computing_addons',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/resource-references/3193f97c-e6d8-41a4-8312-b73483442086',
      },
    },
  ],
};

export function getResourceReferencesData(index?: number, asArray?: boolean) {
  if (index || index === 0) {
    if (asArray) {
      return structuredClone(ResourceReferences.data[index]);
    } else {
      return structuredClone(ResourceReferences.data[index]);
    }
  } else {
    return structuredClone(ResourceReferences);
  }
}
