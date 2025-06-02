import { DataView } from 'primeng/dataview';
import { Paginator } from 'primeng/paginator';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CollectionsSearchResultCardComponent } from '@osf/features/collections/components/collections-search-result-card/collections-search-result-card.component';
import { CollectionSearchResultCard } from '@osf/features/collections/models/collection-search-result-card.models';

@Component({
  selector: 'osf-collections-search-results',
  imports: [DataView, CollectionsSearchResultCardComponent, Paginator],
  templateUrl: './collections-search-results.component.html',
  styleUrl: './collections-search-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsSearchResultsComponent {
  // Mocked search results data
  protected searchResults: CollectionSearchResultCard[] = [
    {
      id: '1',
      title: 'Pseudo-Random Sonications For Brain HIFU',
      description:
        'While transcranial high intensity focused ultrasound is used in clinics for treating essential tremor and proposed for many other brain disorders, this promising treatment modality requires high energy resulting eventually in undesired transcranial high intensity focused ultrasound is used in clinics for treating essential tremor and proposed for many other brain disorders, this promising treatment modality requires high energy resulting eventually in undesired ',
      dateCreated: new Date('2019-01-28'),
      dateModified: new Date('2019-01-28'),
      category: 'Research',
      contributors: [
        { id: '1', name: 'Lin Wang' },
        { id: '2', name: 'Roman Nastyuk' },
      ],
      programArea: 'Technica',
      status: 'Completed',
      collectedType: '',
      dataType: '',
      disease: '',
      gradeLevels: '',
      issue: '',
      reviewsState: '',
      schoolType: '',
      studyDesign: '',
      volume: '',
    },
    {
      id: '2',
      title: 'Simulation Of Transcranial FUS Propagation',
      description:
        "While transcranial high intensity focused ultrasound is used in clinics for treating essential tremor and proposed for many other brain disorders, there are currently no precise tools for patient's selection and treatment planning. in this project, focused ultrasound is used in clinics for treating essential tremor and proposed for many other brain disorders",
      dateCreated: new Date('2019-01-28'),
      dateModified: new Date('2019-01-28'),
      category: 'Research',
      contributors: [{ id: '1', name: 'Lin Wang' }],
      programArea: 'Technica',
      status: 'Active',
      collectedType: '',
      dataType: '',
      disease: '',
      gradeLevels: '',
      issue: '',
      reviewsState: '',
      schoolType: '',
      studyDesign: '',
      volume: '',
    },
    {
      id: '3',
      title: 'Sonications For Brain HIFU',
      description:
        'While transcranial high intensity focused ultrasound is used in clinics for treating essential tremor and proposed for many other brain disorders, this promising treatment modality requires high energy resulting eventually in undesired transcranial high intensity focused ultrasound is used in clinics for treating essential tremor and proposed for many other brain disorders, this promising treatment modality requires high energy resulting eventually in undesired ',
      dateCreated: new Date('2019-01-28'),
      dateModified: new Date('2019-01-28'),
      category: 'Research',
      contributors: [{ id: '2', name: 'Roman Nastyuk' }],
      programArea: 'Technica',
      status: 'Completed',
      collectedType: '',
      dataType: '',
      disease: '',
      gradeLevels: '',
      issue: '',
      reviewsState: '',
      schoolType: '',
      studyDesign: '',
      volume: '',
    },
  ];
}
