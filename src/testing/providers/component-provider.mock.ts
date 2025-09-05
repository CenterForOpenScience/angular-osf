import { Type } from 'ng-mocks';

import { Component, EventEmitter, Input } from '@angular/core';

/**
 * Generates a mock Angular standalone component with dynamically attached `@Input()` and `@Output()` bindings.
 *
 * This utility is designed for use in Angular tests where the actual component is either irrelevant or
 * too complex to include. It allows the test to bypass implementation details while still binding inputs
 * and triggering output events.
 *
 * The resulting mock component:
 * - Accepts any specified inputs via `@Input()`
 * - Emits any specified outputs via `EventEmitter`
 * - Silently swallows unknown property/method accesses to prevent test failures
 *
 * @template T - The component type being mocked (used for typing in test declarations)
 *
 * @param selector - The CSS selector name of the component (e.g., `'osf-files-tree'`)
 * @param inputs - Optional array of `@Input()` property names to mock (e.g., `['files', 'resourceId']`)
 * @param outputs - Optional array of `@Output()` property names to mock as `EventEmitter` (e.g., `['fileClicked']`)
 *
 * @returns A dynamically generated Angular component class that can be imported into test modules.
 *
 * @example
 * ```ts
 * TestBed.configureTestingModule({
 *   imports: [
 *     MockComponentWithSignal<MyComponent>(
 *       'mock-selector',
 *       ['inputA', 'inputB'],
 *       ['outputX']
 *     ),
 *     ComponentUnderTest
 *   ]
 * });
 * ```
 */
export function MockComponentWithSignal<T>(selector: string, inputs: string[] = [], outputs: string[] = []): Type<T> {
  @Component({
    selector,
    standalone: true,
    template: '',
  })
  class MockComponent {
    /**
     * Initializes the mock component by dynamically attaching `EventEmitter`s
     * for all specified output properties.
     *
     * This enables the mocked component to emit events during unit tests,
     * simulating @Output bindings in Angular components.
     *
     * @constructor
     * @remarks
     * This constructor assumes `outputs` is available in the closure scope
     * (from the outer factory function). Each output name in the `outputs` array
     * will be added to the instance as an `EventEmitter`.
     *
     * @example
     * ```ts
     * const MockComponent = MockComponentWithSignal('example-component', [], ['onSave']);
     * const fixture = TestBed.createComponent(MockComponent);
     * fixture.componentInstance.onSave.emit('test'); // Emits 'test' during test
     * ```
     */
    constructor() {
      for (const output of outputs) {
        (this as any)[output] = new EventEmitter<any>();
      }
    }
  }

  /**
   * Dynamically attaches `@Input()` decorators to the mock component prototype
   * for all specified input property names.
   *
   * This enables the mocked component to receive bound inputs during unit tests,
   * simulating real Angular `@Input()` behavior without needing to declare them manually.
   *
   * @remarks
   * This assumes `inputs` is an array of string names passed to the factory function.
   * Each string is registered as an `@Input()` on the `MockComponent.prototype`.
   *
   * @example
   * ```ts
   * const MockComponent = MockComponentWithSignal('example-component', ['title']);
   * ```
   */
  for (const input of inputs) {
    Input()(MockComponent.prototype, input);
  }

  /**
   * Returns the dynamically generated mock component class as a typed Angular component.
   *
   * @typeParam T - The generic type to apply to the returned component, allowing type-safe usage in tests.
   *
   * @returns The mock Angular component class with dynamically attached `@Input()` and `@Output()` properties.
   *
   * @example
   * ```ts
   * const mock = MockComponentWithSignal<MyComponent>('my-selector', ['inputA'], ['outputB']);
   * TestBed.configureTestingModule({
   *   imports: [mock],
   * });
   * ```
   */
  return MockComponent as Type<T>;
}
