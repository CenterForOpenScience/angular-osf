import structuredClone from 'structured-clone';

const OperationInvocation = {
  data: {
    type: 'addon-operation-invocations',
    id: '022c80d6-06b5-452d-9932-19bb135cd5c2',
    attributes: {
      invocation_status: 'SUCCESS',
      operation_kwargs: {
        item_id: '0AIl0aR4C9JAFUk9PVA',
      },
      operation_result: {
        item_id: '0AIl0aR4C9JAFUk9PVA',
        item_name: 'My Drive',
        item_type: 'FOLDER',
        can_be_root: true,
        may_contain_root_candidates: true,
      },
      created: '2025-08-22T18:02:49.901038Z',
      modified: '2025-08-22T18:02:50.849893Z',
      operation_name: 'get_item_info',
    },
    relationships: {
      operation: {
        links: {
          related:
            'https://addons.staging4.osf.io/v1/addon-operation-invocations/022c80d6-06b5-452d-9932-19bb135cd5c2/operation',
        },
        data: {
          type: 'addon-operations',
          id: 'U1RPUkFHRTpnZXRfaXRlbV9pbmZv',
        },
      },
      by_user: {
        links: {
          related:
            'https://addons.staging4.osf.io/v1/addon-operation-invocations/022c80d6-06b5-452d-9932-19bb135cd5c2/by_user',
        },
        data: {
          type: 'user-references',
          id: '0b441148-83e5-4f7f-b302-b07b528b160b',
        },
      },
      thru_account: {
        links: {
          related:
            'https://addons.staging4.osf.io/v1/addon-operation-invocations/022c80d6-06b5-452d-9932-19bb135cd5c2/thru_account',
        },
        data: {
          type: 'authorized-storage-accounts',
          id: '62ed6dd7-f7b7-4003-b7b4-855789c1f991',
        },
      },
      thru_addon: {
        links: {
          related:
            'https://addons.staging4.osf.io/v1/addon-operation-invocations/022c80d6-06b5-452d-9932-19bb135cd5c2/thru_addon',
        },
        data: {
          type: 'configured-storage-addons',
          id: '756579dc-3a24-4849-8866-698a60846ac3',
        },
      },
    },
    links: {
      self: 'https://addons.staging4.osf.io/v1/addon-operation-invocations/022c80d6-06b5-452d-9932-19bb135cd5c2',
    },
  },
};

export function getAddonsOperationInvocation() {
  return structuredClone(OperationInvocation);
}
