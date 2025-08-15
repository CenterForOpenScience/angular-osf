export interface RequestProjectAccessData {
  userId: string;
  projectId: string;
  institutionId: string;
  permission: string;
  messageText: string;
  bccSender: boolean;
  replyTo: boolean;
}
