// metadata formats available from osf backend -- see METADATA_SERIALIZER_REGISTRY:
// https://github.com/CenterForOpenScience/osf.io/blob/develop/osf/metadata/serializers/__init__.py
export enum MetadataRecordFormat {
  Turtle = 'turtle',
  DataciteJson = 'datacite-json',
  DataciteXml = 'datacite-xml',
  SchemaDotOrgDataset = 'google-dataset-json-ld',
}
