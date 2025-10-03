import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';

import { RegistriesTagsComponent } from './registries-tags.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesTagsComponent', () => {
  let component: RegistriesTagsComponent;
  let fixture: ComponentFixture<RegistriesTagsComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'someId' }).build();

    await TestBed.configureTestingModule({
      imports: [RegistriesTagsComponent, OSFTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideMockStore({
          signals: [{ selector: RegistriesSelectors.getSelectedTags, value: [] }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with label', () => {
    const labelElement = fixture.nativeElement.querySelector('label');
    expect(labelElement.textContent).toEqual('project.overview.metadata.tags (common.labels.optional)');
  });

  it('should update tags on change', () => {
    const mockActions = {
      updateDraft: jest.fn().mockReturnValue(of({})),
    } as any;
    Object.defineProperty(component, 'actions', { value: mockActions });
    component.onTagsChanged(['a', 'b']);
    expect(mockActions.updateDraft).toHaveBeenCalledWith('someId', { tags: ['a', 'b'] });
  });
});
