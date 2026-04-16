import { primitives } from './primitives';

export const components = {
  button: {
    outlined: {
      primary: {
        hoverBackground: primitives.colors.bgBlueTwo,
        activeBackground: primitives.colors.bgBlueTwo,
      },
      success: {
        hoverBackground: primitives.colors.greenTwo,
        activeBackground: primitives.colors.greenTwo,
      },
    },
    colorScheme: {
      light: {
        root: {
          success: {
            hoverBackground: primitives.colors.greenThree,
            hoverBorderColor: primitives.colors.greenThree,
          },
          danger: {
            hoverBackground: primitives.colors.redThree,
            hoverBorderColor: primitives.colors.redThree,
          },
          info: {
            background: primitives.colors.transparent,
            hoverBackground: primitives.colors.transparent,
            activeBackground: primitives.colors.transparent,
            borderColor: primitives.colors.transparent,
            hoverBorderColor: primitives.colors.greyTwo,
            activeBorderColor: primitives.colors.greyTwo,
            color: primitives.colors.darkBlueOne,
            hoverColor: primitives.colors.darkBlueOne,
            activeColor: primitives.colors.darkBlueOne,
          },
          secondary: {
            background: primitives.colors.bgBlueThree,
            hoverBackground: primitives.colors.bgBlueTwo,
            activeBackground: primitives.colors.bgBlueThree,
            borderColor: primitives.colors.bgBlueThree,
            hoverBorderColor: primitives.colors.bgBlueTwo,
            color: primitives.colors.darkBlueTwo,
            hoverColor: primitives.colors.prBlueThree,
          },
        },
      },
    },
  },
};
