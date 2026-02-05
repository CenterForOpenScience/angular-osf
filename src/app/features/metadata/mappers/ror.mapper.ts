import { RorFunderOption, RorOrganization, RorSearchResponse } from '../models/ror.model';

export class RorMapper {
  static toFunderOptions(response: RorSearchResponse): RorFunderOption[] {
    return response.items.map((org) => ({
      id: org.id,
      name: this.getRorDisplayName(org),
    }));
  }

  static getRorDisplayName(org: RorOrganization): string {
    const rorDisplay = org.names?.find((n) => n.types?.includes('ror_display'));
    if (rorDisplay?.value) return rorDisplay.value;
    const label = org.names?.find((n) => n.types?.includes('label'));
    if (label?.value) return label.value;
    if (org.names?.length && org.names[0].value) return org.names[0].value;
    return org.id ?? '';
  }
}
