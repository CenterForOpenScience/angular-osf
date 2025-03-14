import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'osf-developer-applications-list',
  imports: [Button, Card, RouterLink],
  templateUrl: './developer-apps-list.component.html',
  styleUrl: './developer-apps-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsListComponent {
  developerApplications: string[] = [
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
    'Developer app name example',
  ];

  onDeleteDeveloperApp(developerApp: string): void {
    console.log('delete', developerApp);
    //TODO implement api integration
  }
}
