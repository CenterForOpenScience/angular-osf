import { RequestProjectAccessData } from '../models';

export function requestProjectAccessMapper(request: RequestProjectAccessData) {
  return {
    data: {
      attributes: {
        comment: request.messageText,
        requested_permissions: request.permission,
        request_type: 'institutional_request',
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
        message_recipient: {
          data: {
            type: 'users',
            id: request.userId,
          },
        },
      },
      type: 'node_requests',
    },
  };
}
