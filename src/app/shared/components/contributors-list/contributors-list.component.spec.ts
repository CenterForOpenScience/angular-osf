import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';

import { provideOSFCore } from '@testing/osf.testing.provider';

describe('ContributorsListComponent', () => {
  let component: ContributorsListComponent;
  let fixture: ComponentFixture<ContributorsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContributorsListComponent],
      providers: [provideOSFCore(), provideRouter([])],
    });
    fixture = TestBed.createComponent(ContributorsListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('contributors', []);
    fixture.detectChanges();
  });

  function setContributors(contributors: ContributorModel[] | Partial<ContributorModel>[]) {
    fixture.componentRef.setInput('contributors', contributors);
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have false default values for optional inputs', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.hasLoadMore()).toBe(false);
    expect(component.readonly()).toBe(false);
    expect(component.anonymous()).toBe(false);
  });

  it('should accept contributors input', () => {
    const contributors: Partial<ContributorModel>[] = [{ id: '1', userId: 'u1', fullName: 'User One' }];
    setContributors(contributors);
    expect(component.contributors()).toEqual(contributors);
  });

  it('should emit load more event', () => {
    const emitSpy = vi.spyOn(component.loadMoreContributors, 'emit');
    component.loadMoreContributors.emit();
    expect(emitSpy).toHaveBeenCalled();
  });
});
