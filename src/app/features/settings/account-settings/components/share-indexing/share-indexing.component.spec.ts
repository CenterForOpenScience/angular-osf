import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserState } from '@osf/core/store/user';
import { ToastService } from '@shared/services';

import { ShareIndexingComponent } from './share-indexing.component';

describe('ShareIndexingComponent', () => {
  let component: ShareIndexingComponent;
  let fixture: ComponentFixture<ShareIndexingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareIndexingComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([UserState]),
        MockProvider(ToastService),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareIndexingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateIndexing method', () => {
    const updateIndexingSpy = jest.spyOn(component, 'updateIndexing');

    component.updateIndexing();

    expect(updateIndexingSpy).toHaveBeenCalled();
  });
});
