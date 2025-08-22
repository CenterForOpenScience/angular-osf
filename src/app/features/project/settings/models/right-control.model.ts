import { SubscriptionEvent } from '@osf/shared/enums';
import { SelectOption } from '@osf/shared/models';

export interface RightControl {
  type: 'dropdown';
  label?: string;
  value: boolean | string;
  options: SelectOption[];
  event?: SubscriptionEvent;
}
