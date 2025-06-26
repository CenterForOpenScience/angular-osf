export interface DeleteConfirmationOptions {
  headerKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headerParams?: any;
  messageKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageParams?: any;
  acceptLabelKey?: string;
  acceptLabelType?: string;
  onConfirm: () => void;
}

export interface AcceptConfirmationOptions {
  headerKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headerParams?: any;
  messageKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageParams?: any;
  acceptLabelKey?: string;
  onConfirm: () => void;
  onReject: () => void;
}
