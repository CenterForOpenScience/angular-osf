export interface SendMessageRequest {
  userId: string;
  institutionId: string;
  messageText: string;
  bccSender: boolean;
  replyTo: boolean;
}
