import { ScopeDataJsonApi, ScopeModel } from '../models';

export class ScopeMapper {
  static fromResponse(response: ScopeDataJsonApi[]): ScopeModel[] {
    return response.map((scope) => ({
      id: scope.id,
      description: scope.attributes.description,
    }));
  }
}
