import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider, MockProviders } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MOCK_PROVIDER } from '@shared/mocks';

import { PreprintProviderHeroComponent } from './preprint-provider-hero.component';

describe('PreprintProviderHeroComponent', () => {
  let component: PreprintProviderHeroComponent;
  let fixture: ComponentFixture<PreprintProviderHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintProviderHeroComponent, MockPipe(TranslatePipe)],
      providers: [MockProviders(DialogService, TranslateService, ActivatedRoute), MockProvider(TranslateService)],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintProviderHeroComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('searchControl', new FormControl(''));
    fixture.componentRef.setInput('preprintProvider', MOCK_PROVIDER);
    fixture.componentRef.setInput('isPreprintProviderLoading', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
