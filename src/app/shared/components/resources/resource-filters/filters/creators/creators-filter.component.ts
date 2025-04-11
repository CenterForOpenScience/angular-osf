import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Select, SelectChangeEvent } from 'primeng/select';
import { debounceTime, finalize, tap } from 'rxjs';
import { Creator } from '@shared/components/resources/resource-filters/models/creator/creator.entity';
import { ResourceFiltersService } from '@shared/components/resources/resource-filters/resource-filters.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { SetCreator } from '@shared/components/resources/resource-filters/store';

@Component({
  selector: 'osf-creators-filter',
  imports: [Select, ReactiveFormsModule],
  templateUrl: './creators-filter.component.html',
  styleUrl: './creators-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatorsFilterComponent implements OnInit {
  readonly #store = inject(Store);
  readonly #resourceFiltersService = inject(ResourceFiltersService);

  protected searchCreatorsResults = signal<Creator[]>([]);
  protected creatorsOptions = computed(() => {
    return this.searchCreatorsResults().map((creator) => ({
      label: creator.name,
      value: creator.id,
    }));
  });
  protected creatorsLoading = signal<boolean>(false);

  readonly creatorsGroup = new FormGroup({
    creator: new FormControl(''),
  });

  ngOnInit() {
    if (this.creatorsGroup) {
      this.creatorsGroup
        ?.get('creator')!
        .valueChanges.pipe(
          debounceTime(500),
          tap(() => this.creatorsLoading.set(true)),
          finalize(() => this.creatorsLoading.set(false)),
        )
        .subscribe((searchText) => {
          console.log(searchText);
          if (searchText && searchText !== '') {
            this.#resourceFiltersService
              .getCreators(searchText)
              .subscribe((creators) => {
                this.searchCreatorsResults.set(creators);
              });
          } else {
            this.searchCreatorsResults.set([]);
            this.#store.dispatch(new SetCreator(''));
          }
        });
    }
  }

  setCreator(event: SelectChangeEvent): void {
    if ((event.originalEvent as PointerEvent).pointerId) {
      this.#store.dispatch(new SetCreator(event.value));
    }
  }
}
