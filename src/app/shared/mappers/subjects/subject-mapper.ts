import { NodeSubjectModel, Subject, SubjectData, SubjectDataJsonApi, SubjectsResponseJsonApi } from '@shared/models';

export class SubjectMapper {
  static mapSubjectsResponse(subjectData: SubjectData[]): NodeSubjectModel[] {
    const subjectMap = new Map<string, NodeSubjectModel>();
    const rootSubjects: NodeSubjectModel[] = [];

    const processSubject = (data: SubjectData, level = 0): NodeSubjectModel => {
      if (subjectMap.has(data.id)) {
        return subjectMap.get(data.id)!;
      }

      const subject: NodeSubjectModel = {
        id: data.id,
        text: data.attributes.text,
        taxonomy_name: data.attributes.taxonomy_name,
        level: level,
        children: [],
      };

      subjectMap.set(data.id, subject);
      return subject;
    };

    subjectData.forEach((data) => {
      processSubject(data);

      if (data.embeds?.parent?.data) {
        const parentData = data.embeds.parent.data;
        processSubject(parentData);

        if (parentData.embeds?.parent?.data) {
          processSubject(parentData.embeds.parent.data);
        }
      }
    });

    subjectData.forEach((data) => {
      const subject = subjectMap.get(data.id);
      if (!subject) return;

      if (data.embeds?.parent?.data) {
        const parentData = data.embeds.parent.data;
        const parent = subjectMap.get(parentData.id);

        if (parent) {
          subject.parent = parent;

          if (!parent.children?.some((child) => child.id === subject.id)) {
            if (!parent.children) parent.children = [];
            parent.children.push(subject);
          }

          if (parentData.embeds?.parent?.data) {
            const grandparentData = parentData.embeds.parent.data;
            const grandparent = subjectMap.get(grandparentData.id);

            if (grandparent && !parent.parent) {
              parent.parent = grandparent;

              if (!grandparent.children?.some((child) => child.id === parent.id)) {
                if (!grandparent.children) grandparent.children = [];
                grandparent.children.push(parent);
              }
            }
          }
        }
      }
    });

    const calculateLevels = (subject: NodeSubjectModel): number => {
      if (subject.parent) {
        subject.level = calculateLevels(subject.parent) + 1;
      } else {
        subject.level = 0;
        if (!rootSubjects.some((root) => root.id === subject.id)) {
          rootSubjects.push(subject);
        }
      }
      return subject.level;
    };

    Array.from(subjectMap.values()).forEach((subject) => {
      calculateLevels(subject);
    });

    const sortSubjects = (subjects: NodeSubjectModel[]): NodeSubjectModel[] => {
      return subjects
        .sort((a, b) => a.text.localeCompare(b.text))
        .map((subject) => ({
          ...subject,
          children: subject.children ? sortSubjects(subject.children) : [],
        }));
    };

    return sortSubjects(rootSubjects);
  }

  static fromSubjectsResponseJsonApi(response: SubjectsResponseJsonApi): Subject[] {
    return response.data.map((data) => {
      const subject: Subject = {
        id: data.id,
        name: data.attributes.text,
        children: data.relationships.children?.links.related.meta.count > 0 ? [] : undefined,
        parent: data.embeds?.parent?.data ? this.setSubjectParent(data.embeds.parent.data) : null,
      };

      return subject;
    });
  }

  private static setSubjectParent(data: SubjectDataJsonApi): Subject | null {
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
