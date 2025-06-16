import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

import { components } from './components';
import { semantic } from './semantic';

const CustomPreset = definePreset(Aura, {
  semantic: semantic,
  components: components,
});

export default CustomPreset;
