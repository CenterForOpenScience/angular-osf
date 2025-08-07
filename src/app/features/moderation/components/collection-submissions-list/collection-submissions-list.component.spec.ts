import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSubmissionsListComponent } from '@osf/features/moderation/components';
import { CollectionsModerationState } from '@osf/features/moderation/store/collections-moderation';

describe('SubmissionsListComponent', () => {
  let component: CollectionSubmissionsListComponent;
  let fixture: ComponentFixture<CollectionSubmissionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionSubmissionsListComponent, MockPipe(TranslatePipe)],
      providers: [provideStore([CollectionsModerationState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionSubmissionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
