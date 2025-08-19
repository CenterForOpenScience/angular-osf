import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { IS_WEB } from '@osf/shared/helpers';
import { IconComponent } from '@shared/components';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let isWebSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [FooterComponent, MockComponent(IconComponent), MockPipe(TranslatePipe)],
      providers: [MockProvider(TranslateService), MockProvider(ActivatedRoute), MockProvider(IS_WEB, isWebSubject)],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
