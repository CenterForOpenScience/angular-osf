import { SendMessageRequest } from '../models';

export function sendMessageRequestMapper(request: SendMessageRequest) {
  return {
    data: {
      attributes: {
        message_text: request.messageText,
        message_type: 'institutional_request',
        bcc_sender: request.bccSender,
        reply_to: request.replyTo,
      },
      relationships: {
        institution: {
          data: {
            type: 'institutions',
            id: request.institutionId,
          },
        },
      },
      type: 'user_messages',
    },
  };
}
