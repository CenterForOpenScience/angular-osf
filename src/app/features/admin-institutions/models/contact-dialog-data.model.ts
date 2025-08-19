import { ContactOption } from '../enums';

export interface ContactDialogData {
  emailContent: string;
  selectedOption: ContactOption;
  permission?: string;
  ccSender: boolean;
  allowReplyToSender: boolean;
}
