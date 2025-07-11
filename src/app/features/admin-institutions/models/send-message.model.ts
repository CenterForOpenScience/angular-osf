export interface SendMessageRequest {
  userId: string;
  institutionId: string;
  messageText: string;
  bccSender: boolean;
  replyTo: boolean;
}

export interface SendMessageResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      message_text: string;
      message_type: string;
      bcc_sender: boolean;
      reply_to: boolean;
    };
  };
}
