export enum ReviewActionTrigger {
  Submit = 'submit',
  AcceptSubmission = 'accept_submission',
  RejectSubmission = 'reject_submission',
  ForceWithdraw = 'force_withdraw',
  RequestWithdrawal = 'request_withdrawal',
  AcceptWithdrawal = 'accept_withdrawal',
  RejectWithdrawal = 'reject_withdrawal',
  RequestEmbargoTermination = 'request_embargo_termination',
}

export enum SchemaResponseActionTrigger {
  SubmitRevision = 'submit',
  AdminApproveRevision = 'approve',
  AdminRejectRevision = 'admin_reject',
  AcceptRevision = 'accept',
  RejectRevision = 'moderator_reject',
}
