import { ScopeJsonApi, ScopeModel } from '../models';

export class ScopeMapper {
  static fromResponse(response: ScopeJsonApi[]): ScopeModel[] {
    return response.map((scope) => ({
      id: scope.id,
      description: scope.attributes.description,
    }));
  }
}
