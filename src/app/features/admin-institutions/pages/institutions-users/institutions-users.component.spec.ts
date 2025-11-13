import { provideStore } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserState } from '@core/store/user';
import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { InstitutionsAdminState } from '@osf/features/admin-institutions/store';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { InstitutionsSearchState } from '@osf/shared/stores/institutions-search';

import { InstitutionsUsersComponent } from './institutions-users.component';

import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';

describe('InstitutionsUsersComponent', () => {
  let component: InstitutionsUsersComponent;
  let fixture: ComponentFixture<InstitutionsUsersComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  beforeEach(async () => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [InstitutionsUsersComponent, ...MockComponents(AdminTableComponent, SelectComponent), OSFTestingModule],
      providers: [
        MockProvider(ActivatedRoute, { queryParams: of({}) }),
        MockProvider(Router),
        TranslateServiceMock,
        MockProvider(ToastService),
        provideStore([InstitutionsAdminState, UserState, InstitutionsSearchState]),
        MockProvider(CustomDialogService, mockCustomDialogService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
