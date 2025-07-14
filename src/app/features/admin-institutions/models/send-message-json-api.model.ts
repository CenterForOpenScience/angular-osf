export interface SendMessageResponseJsonApi {
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
