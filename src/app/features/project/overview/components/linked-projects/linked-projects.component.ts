import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { TruncatedTextComponent } from '@shared/components/truncated-text/truncated-text.component';

@Component({
  selector: 'osf-linked-projects',
  imports: [TruncatedTextComponent, Skeleton, Button, NgClass, Menu, TranslatePipe],
  templateUrl: './linked-projects.component.html',
  styleUrl: './linked-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedProjectsComponent {
  protected linkedProjects = select(ProjectOverviewSelectors.getLinkedProjects);
  protected isLinkedProjectsLoading = select(ProjectOverviewSelectors.getLinkedProjectsLoading);
}
