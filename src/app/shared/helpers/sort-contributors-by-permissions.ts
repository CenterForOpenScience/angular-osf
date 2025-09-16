import { Creator, IsContainedBy, QualifiedAttribution, ResourceModel } from '@shared/models';

export function getSortedContributorsByPermissions(base: ResourceModel | IsContainedBy) {
  const objectOrder = Object.fromEntries(
    base.qualifiedAttribution.map((item: QualifiedAttribution) => [item.agentId, item.order])
  );
  return base.creators
    ?.map((item: Creator) => ({
      ...item,
      index: objectOrder[item.absoluteUrl],
    }))
    .sort((a: { index: number }, b: { index: number }) => a.index - b.index);
}
