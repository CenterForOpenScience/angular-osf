import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { components } from './components';
import { semantic } from './semantic';

const CustomPreset = definePreset(Aura, {
  semantic: semantic,
  components: components,
});

export default CustomPreset;
