import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { RegistrationCardComponent } from '@osf/shared/components/registration-card/registration-card.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';

import { RegistrationsComponent } from './registrations.component';

describe('RegistrationsComponent', () => {
  let component: RegistrationsComponent;
  let fixture: ComponentFixture<RegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegistrationsComponent,
        ...MockComponents(
          RegistrationCardComponent,
          SubHeaderComponent,
          FormsModule,
          TranslatePipe,
          LoadingSpinnerComponent,
          CustomPaginatorComponent
        ),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
