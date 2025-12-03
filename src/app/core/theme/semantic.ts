import { palette } from '@primeng/themes';

import { primitives } from './primitives';

const primaryPalette = palette(getCssVariableValue('--pr-blue-1'));
const secondaryPalette = palette(getCssVariableValue('--bg-blue-3'));
const successPalette = palette(getCssVariableValue('--green-1'));
const dangerPalette = palette(getCssVariableValue('--red-1'));
const infoPalette = palette(getCssVariableValue('--blue-1'));

export const semantic = {
  primary: primaryPalette,
  surface: secondaryPalette,
  red: dangerPalette,
  green: successPalette,
  sky: infoPalette,
  colorScheme: {
    light: {
      primary: {
        hoverColor: primitives.colors.prBlueThree,
      },
    },
  },
};

function getCssVariableValue(variableName: string): string {
  if (typeof document === 'undefined' || typeof getComputedStyle === 'undefined') {
    const fallbackColors: Record<string, string> = {
      '--pr-blue-1': '#337ab7',
      '--bg-blue-3': '#f1f8fd',
      '--green-1': '#357935',
      '--red-1': '#b73333',
      '--blue-1': '#3792b1',
    };

    return fallbackColors[variableName] || '';
  }

  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}
