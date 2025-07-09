import { SubjectDataJsonApi, SubjectModel, SubjectsResponseJsonApi } from '@shared/models';

export class SubjectMapper {
  static fromSubjectsResponseJsonApi(response: SubjectsResponseJsonApi): SubjectModel[] {
    return response.data.map((data) => {
      const subject: SubjectModel = {
        id: data.id,
        name: data.attributes.text,
        children: data.relationships.children?.links.related.meta.count > 0 ? [] : undefined,
        parent: data.embeds?.parent?.data ? this.setSubjectParent(data.embeds.parent.data) : null,
      };

      return subject;
    });
  }

  private static setSubjectParent(data: SubjectDataJsonApi): SubjectModel | null {
    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.attributes.text,
      children: data.relationships?.children?.links?.related?.meta?.count > 0 ? [] : undefined,
      parent: data.embeds?.parent?.data ? this.setSubjectParent(data.embeds.parent.data) : null,
    };
  }
}
