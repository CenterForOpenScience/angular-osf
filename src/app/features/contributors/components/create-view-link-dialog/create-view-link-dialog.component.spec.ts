import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentCheckboxItemComponent } from '@osf/shared/components/component-checkbox-item/component-checkbox-item.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { CreateViewLinkDialogComponent } from './create-view-link-dialog.component';

import { MOCK_RESOURCE_INFO, MOCK_RESOURCE_WITH_CHILDREN } from '@testing/mocks/resource.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: Create View Link Dialog', () => {
  let component: CreateViewLinkDialogComponent;
  let fixture: ComponentFixture<CreateViewLinkDialogComponent>;
  let dialogRef: jest.Mocked<DynamicDialogRef>;
  let dialogConfig: DynamicDialogConfig;

  beforeEach(async () => {
    dialogRef = {
      close: jest.fn(),
    } as any;

    dialogConfig = {
      data: MOCK_RESOURCE_INFO,
    } as DynamicDialogConfig;

    await TestBed.configureTestingModule({
      imports: [
        CreateViewLinkDialogComponent,
        OSFTestingModule,
        ...MockComponents(TextInputComponent, LoadingSpinnerComponent, ComponentCheckboxItemComponent),
      ],
      providers: [
        provideMockStore({
          signals: [
            {
              selector: CurrentResourceSelectors.getResourceWithChildren,
              value: MOCK_RESOURCE_WITH_CHILDREN,
            },
            {
              selector: CurrentResourceSelectors.isResourceWithChildrenLoading,
              value: false,
            },
          ],
        }),
        MockProvider(DynamicDialogRef, dialogRef),
        MockProvider(DynamicDialogConfig, dialogConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateViewLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when linkName is empty', () => {
    expect(component.linkName.invalid).toBe(true);
  });

  it('should have invalid form when linkName contains only whitespace', () => {
    component.linkName.setValue('   ');
    expect(component.linkName.invalid).toBe(true);
  });

  it('should have valid form when linkName has content', () => {
    component.linkName.setValue('Test Link');
    expect(component.linkName.valid).toBe(true);
  });

  it('should mark current resource as checked and disabled', () => {
    const currentResourceItem = component.componentsList().find((item) => item.id === 'project-123');
    expect(currentResourceItem?.checked).toBe(true);
    expect(currentResourceItem?.disabled).toBe(true);
    expect(currentResourceItem?.isCurrent).toBe(true);
  });

  it('should uncheck children when parent is unchecked', () => {
    const parentItem = component.componentsList().find((item) => item.id === 'component-1');

    component.onCheckboxChange({ ...parentItem!, checked: true });
    fixture.detectChanges();

    component.onCheckboxChange({ ...parentItem!, checked: false });
    fixture.detectChanges();

    const updatedChildItem = component.componentsList().find((item) => item.id === 'component-3');
    expect(updatedChildItem?.checked).toBe(false);
  });

  it('should handle items without parent correctly', () => {
    const rootItem = component.componentsList().find((item) => item.id === 'project-123');
    expect(rootItem?.disabled).toBe(true);
  });

  it('should add link and close dialog when form is valid', () => {
    component.linkName.setValue('Test Link');
    component.anonymous.set(false);

    component.addLink();

    expect(dialogRef.close).toHaveBeenCalledWith({
      attributes: {
        name: 'Test Link',
        anonymous: false,
      },
      nodes: [{ id: 'project-123', type: 'nodes' }],
    });
  });

  it('should add link with relationships when additional components are selected', () => {
    const result = component['buildLinkData'](
      ['project-123', 'component-1', 'component-2'],
      'project-123',
      'Test Link',
      false
    );

    expect(result).toEqual({
      attributes: {
        name: 'Test Link',
        anonymous: false,
      },
      nodes: [{ id: 'project-123', type: 'nodes' }],
      relationships: {
        nodes: {
          data: [
            { id: 'component-1', type: 'nodes' },
            { id: 'component-2', type: 'nodes' },
          ],
        },
      },
    });
  });

  it('should build correct link data with only root project', () => {
    component.linkName.setValue('Test Link');
    component.anonymous.set(true);

    const result = component['buildLinkData'](['project-123'], 'project-123', 'Test Link', true);

    expect(result).toEqual({
      attributes: {
        name: 'Test Link',
        anonymous: true,
      },
      nodes: [{ id: 'project-123', type: 'nodes' }],
    });
  });

  it('should build correct link data with root project and components', () => {
    component.linkName.setValue('Test Link');
    component.anonymous.set(false);

    const result = component['buildLinkData'](
      ['project-123', 'component-1', 'component-2'],
      'project-123',
      'Test Link',
      false
    );

    expect(result).toEqual({
      attributes: {
        name: 'Test Link',
        anonymous: false,
      },
      nodes: [{ id: 'project-123', type: 'nodes' }],
      relationships: {
        nodes: {
          data: [
            { id: 'component-1', type: 'nodes' },
            { id: 'component-2', type: 'nodes' },
          ],
        },
      },
    });
  });

  it('should build correct link data without root project', () => {
    const result = component['buildLinkData'](['component-1', 'component-2'], 'project-123', 'Test Link', true);

    expect(result).toEqual({
      attributes: {
        name: 'Test Link',
        anonymous: true,
      },
      nodes: [],
      relationships: {
        nodes: {
          data: [
            { id: 'component-1', type: 'nodes' },
            { id: 'component-2', type: 'nodes' },
          ],
        },
      },
    });
  });
});
