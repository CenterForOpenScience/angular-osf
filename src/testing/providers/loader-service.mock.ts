import { signal } from '@angular/core';

export class LoaderServiceMock {
  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  show = jest.fn(() => this._isLoading.set(true));
  hide = jest.fn(() => this._isLoading.set(false));
}
