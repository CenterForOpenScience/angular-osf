import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
} from 'primeng/accordion';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ResourceType } from '@osf/features/search/models/resource-type.enum';
import { Resource } from '@osf/features/search/models/resource.entity';

@Component({
  selector: 'osf-resource-card',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    DatePipe,
    NgOptimizedImage,
  ],
  templateUrl: './resource-card.component.html',
  styleUrl: './resource-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCardComponent {
  item = input.required<Resource>();

  protected readonly ResourceType = ResourceType;
}
