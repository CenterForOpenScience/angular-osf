import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from './contributors-list.component';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ContributorsListComponent', () => {
  let component: ContributorsListComponent;
  let fixture: ComponentFixture<ContributorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorsListComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorsListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('contributors', [MOCK_CONTRIBUTOR]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
