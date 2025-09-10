import { BehaviorSubject, of } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

export class ActivatedRouteMockBuilder {
  private paramsObj: Record<string, any> = {};
  private queryParamsObj: Record<string, any> = {};
  private dataObj: Record<string, any> = {};

  private params$ = new BehaviorSubject<Record<string, any>>({});
  private queryParams$ = new BehaviorSubject<Record<string, any>>({});
  private data$ = new BehaviorSubject<Record<string, any>>({});

  static create(): ActivatedRouteMockBuilder {
    return new ActivatedRouteMockBuilder();
  }

  withId(id: string): ActivatedRouteMockBuilder {
    this.paramsObj = { ...this.paramsObj, id };
    this.params$.next(this.paramsObj);
    return this;
  }

  withParams(params: Record<string, any>): ActivatedRouteMockBuilder {
    this.paramsObj = { ...this.paramsObj, ...params };
    this.params$.next(this.paramsObj);
    return this;
  }

  withQueryParams(query: Record<string, any>): ActivatedRouteMockBuilder {
    this.queryParamsObj = { ...this.queryParamsObj, ...query };
    this.queryParams$.next(this.queryParamsObj);
    return this;
  }

  withData(data: Record<string, any>): ActivatedRouteMockBuilder {
    this.dataObj = { ...this.dataObj, ...data };
    this.data$.next(this.dataObj);
    return this;
  }

  build(): Partial<ActivatedRoute> {
    const parent = {
      params: of(this.paramsObj),
      snapshot: { params: this.paramsObj },
    } as Partial<ActivatedRoute>;

    const route: Partial<ActivatedRoute> = {
      parent: parent as ActivatedRoute,
      snapshot: { params: this.paramsObj, queryParams: this.queryParamsObj, data: this.dataObj } as any,
      params: this.params$.asObservable(),
      queryParams: this.queryParams$.asObservable(),
      data: this.data$.asObservable(),
    };

    this.params$.next(this.paramsObj);
    this.queryParams$.next(this.queryParamsObj);
    this.data$.next(this.dataObj);

    return route;
  }
}

export const ActivatedRouteMock = {
  withId(id: string) {
    return ActivatedRouteMockBuilder.create().withId(id);
  },
  withParams(params: Record<string, any>) {
    return ActivatedRouteMockBuilder.create().withParams(params);
  },
  withQueryParams(query: Record<string, any>) {
    return ActivatedRouteMockBuilder.create().withQueryParams(query);
  },
  withData(data: Record<string, any>) {
    return ActivatedRouteMockBuilder.create().withData(data);
  },
};
