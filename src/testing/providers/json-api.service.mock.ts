import { Observable, of } from 'rxjs';

import { Mock, vi } from 'vitest';

import { HttpContext, HttpEvent } from '@angular/common/http';

import { JsonApiService } from '@osf/shared/services/json-api.service';

type GetFn = (
  url: string,
  params?: Record<string, unknown>,
  context?: HttpContext,
  headers?: Record<string, string>
) => Observable<unknown>;
type PostFn = (
  url: string,
  body?: unknown,
  params?: Record<string, unknown>,
  headers?: Record<string, string>
) => Observable<unknown>;
type PatchFn = (
  url: string,
  body: unknown,
  params?: Record<string, unknown>,
  headers?: Record<string, string>,
  context?: HttpContext
) => Observable<unknown>;
type PutFn = (url: string, body: unknown, params?: Record<string, unknown>) => Observable<unknown>;
type PutFileFn = (url: string, file: File, params?: Record<string, string>) => Observable<HttpEvent<unknown>>;
type DeleteFn = (
  url: string,
  body?: unknown,
  headers?: Record<string, string>,
  context?: HttpContext
) => Observable<void>;

export type JsonApiServiceMockType = Pick<JsonApiService, 'get' | 'post' | 'patch' | 'put' | 'putFile' | 'delete'> & {
  get: Mock<GetFn>;
  post: Mock<PostFn>;
  patch: Mock<PatchFn>;
  put: Mock<PutFn>;
  putFile: Mock<PutFileFn>;
  delete: Mock<DeleteFn>;
};

export class JsonApiServiceMockBuilder {
  private getMock: Mock<GetFn> = vi.fn().mockReturnValue(of({}));
  private postMock: Mock<PostFn> = vi.fn().mockReturnValue(of({}));
  private patchMock: Mock<PatchFn> = vi.fn().mockReturnValue(of({}));
  private putMock: Mock<PutFn> = vi.fn().mockReturnValue(of({}));
  private putFileMock: Mock<PutFileFn> = vi.fn().mockReturnValue(of({} as HttpEvent<unknown>));
  private deleteMock: Mock<DeleteFn> = vi.fn().mockReturnValue(of(void 0));

  static create(): JsonApiServiceMockBuilder {
    return new JsonApiServiceMockBuilder();
  }

  withGet(mockImpl: Mock<GetFn>): JsonApiServiceMockBuilder {
    this.getMock = mockImpl;
    return this;
  }

  withPost(mockImpl: Mock<PostFn>): JsonApiServiceMockBuilder {
    this.postMock = mockImpl;
    return this;
  }

  withPatch(mockImpl: Mock<PatchFn>): JsonApiServiceMockBuilder {
    this.patchMock = mockImpl;
    return this;
  }

  withPut(mockImpl: Mock<PutFn>): JsonApiServiceMockBuilder {
    this.putMock = mockImpl;
    return this;
  }

  withPutFile(mockImpl: Mock<PutFileFn>): JsonApiServiceMockBuilder {
    this.putFileMock = mockImpl;
    return this;
  }

  withDelete(mockImpl: Mock<DeleteFn>): JsonApiServiceMockBuilder {
    this.deleteMock = mockImpl;
    return this;
  }

  build(): JsonApiServiceMockType {
    return {
      get: this.getMock,
      post: this.postMock,
      patch: this.patchMock,
      put: this.putMock,
      putFile: this.putFileMock,
      delete: this.deleteMock,
    } as JsonApiServiceMockType;
  }
}

export const JsonApiServiceMock = {
  create() {
    return JsonApiServiceMockBuilder.create();
  },
  simple() {
    return JsonApiServiceMockBuilder.create().build();
  },
};
