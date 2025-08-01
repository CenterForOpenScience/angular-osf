import { Pipe, PipeTransform } from '@angular/core';

import { User } from '@osf/core/models';

import { GENERATIONAL_SUFFIXES, ORDINAL_SUFFIXES } from '../constants/citation-suffix.const';

@Pipe({
  name: 'citationFormat',
})
export class CitationFormatPipe implements PipeTransform {
  transform(user: Partial<User> | null | undefined, format: 'apa' | 'mla' = 'apa'): string {
    if (!user) return '';

    const familyName = user.familyName ?? '';
    const givenName = user.givenName ?? '';
    const middleInitials = this.getInitials(user.middleNames);
    const suffix = user.suffix ? `, ${this.formatSuffix(user.suffix)}` : '';

    let cite = '';

    if (format === 'apa') {
      const initials = [this.getInitials(givenName), middleInitials].filter(Boolean).join(' ');
      cite = `${familyName}, ${initials}${suffix}`;
    } else {
      cite = `${familyName}, ${givenName} ${middleInitials}${suffix}`.trim();
    }

    return cite.endsWith('.') ? cite : `${cite}.`;
  }

  private getInitials(names?: string): string {
    return (names || '')
      .trim()
      .split(/\s+/)
      .map((n) => (/^[a-z]/i.test(n) ? `${n[0].toUpperCase()}.` : ''))
      .filter(Boolean)
      .join(' ');
  }

  private formatSuffix(suffix: string): string {
    const lower = suffix.toLowerCase();

    if (GENERATIONAL_SUFFIXES.includes(lower)) {
      return `${lower.charAt(0).toUpperCase() + lower.slice(1)}.`;
    }

    if (ORDINAL_SUFFIXES.includes(lower)) {
      return lower.toUpperCase();
    }

    return suffix;
  }
}
