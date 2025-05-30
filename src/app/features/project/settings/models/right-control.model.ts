import { SubscriptionEvent } from '@shared/enums';
import { SelectOption } from '@shared/models';

export interface RightControl {
  type: 'dropdown';
  label?: string;
  value: boolean | string;
  options: SelectOption[];
  event?: SubscriptionEvent;
}
