import { Type } from 'ng-mocks';

import { Component, EventEmitter, Input } from '@angular/core';

export function MockComponentWithSignal<T>(
  selector: string,
  inputs: string[] = [] /*, outputs: string[] = []*/
): Type<T> {
  @Component({
    selector,
    standalone: true,
    template: '',
  })
  class MockComponent {
    constructor() {
      /*
      for (const output of outputs) {
        (this as any)[output] = new EventEmitter<any>();
      }
        */

      return new Proxy(this, {
        get(target, prop) {
          if (!(prop in target)) {
            // eslint-disable-next-line
            // @ts-ignore
            target[prop] = new EventEmitter<any>();
          }
          // eslint-disable-next-line
          // @ts-ignore
          return target[prop];
        },
        set(target, prop, value) {
          // eslint-disable-next-line
          // @ts-ignore
          target[prop] = value;
          return true;
        },
      });
    }
  }

  // Dynamically attach @Input()
  for (const input of inputs) {
    Input()(MockComponent.prototype, input);
  }

  return MockComponent as Type<T>;
}
