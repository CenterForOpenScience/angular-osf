import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DeveloperApp } from '@osf/features/settings/developer-apps/developer-app.entity';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
  selector: 'osf-developer-application-details',
  imports: [Button, Card, RouterLink, InputText, IconField, InputIcon],
  templateUrl: './developer-app-details.component.html',
  styleUrl: './developer-app-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppDetailsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  developerAppId = signal<string | null>(null);
  developerApp = signal<DeveloperApp>({
    id: '1',
    name: 'Example name',
  });
  isClientSecretVisible = signal(false);
  clientSecret = signal<string>('asdfasdfasdfasdfasdf');
  hiddenClientSecret = computed<string>(() =>
    '*'.repeat(this.clientSecret().length),
  );

  ngOnInit(): void {
    this.developerAppId.set(this.activatedRoute.snapshot.params['id']);
  }

  onDeleteAppBtnClicked(): void {
    //TODO integrate API
  }

  onResetClientSecretBtnClicked(): void {
    //TODO integrate API
  }

  copyClientId(): void {
    console.log('copy client id');
  }
}
