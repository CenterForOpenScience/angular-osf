import { Directive, ElementRef, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[osfFormError]',
  standalone: true,
})
export class FormErrorDirective implements OnInit, OnDestroy {
  control = input.required<AbstractControl>();
  errorMessage = input.required<string>();

  private statusChanges$?: Subscription;
  private errorElement?: HTMLElement;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (!this.control() || !this.errorMessage()) {
      console.warn(
        'FormErrorDirective: control and errorMessage inputs are required',
      );
      return;
    }

    this.statusChanges$ = this.control().statusChanges.subscribe(() => {
      this.updateErrorState();
    });
  }

  ngOnDestroy(): void {
    this.statusChanges$?.unsubscribe();
    this.errorElement?.remove();
  }

  private updateErrorState(): void {
    const shouldShowError = this.control().invalid && this.control().touched;

    if (shouldShowError && !this.errorElement) {
      this.createErrorElement();
    } else if (!shouldShowError && this.errorElement) {
      this.errorElement.remove();
      this.errorElement = undefined;
    }
  }

  private createErrorElement(): void {
    this.errorElement = document.createElement('small');
    this.errorElement.className = 'text-danger';
    this.errorElement.textContent = this.errorMessage();
    this.el.nativeElement.parentNode.appendChild(this.errorElement);
  }
}
