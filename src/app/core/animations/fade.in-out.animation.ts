import { animate, style, transition, trigger } from '@angular/animations';

/**
 * Angular animation trigger for fading elements in and out.
 *
 * This trigger can be used with Angular structural directives like `*ngIf` or `@if`
 * to smoothly animate the appearance and disappearance of components or elements.
 *
 * ## Usage:
 *
 * In the component decorator:
 * ```ts
 * @Component({
 *   selector: 'my-component',
 *   templateUrl: './my.component.html',
 *   animations: [fadeInOut]
 * })
 * export class MyComponent {}
 * ```
 *
 * In the template:
 * ```html
 * @if (show) {
 *   <div @fadeInOut>
 *     Fades in and out!
 *   </div>
 * }
 * ```
 *
 * ## Transitions:
 * - **:enter** — Fades in from opacity `0` to `1` over `200ms`.
 * - **:leave** — Fades out from opacity `1` to `0` over `200ms`.
 *
 * @returns An Angular `AnimationTriggerMetadata` object used for component animations.
 */
export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [style({ opacity: 0 }), animate('200ms', style({ opacity: 1 }))]),
  transition(':leave', [animate('200ms', style({ opacity: 0 }))]),
]);
