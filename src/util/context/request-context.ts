import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  userId?: number | string;
  companyId?: number | string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export function getContext(): RequestContext {
  return requestContext.getStore() ?? {};
}
