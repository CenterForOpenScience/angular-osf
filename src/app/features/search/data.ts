import { Resource } from '@osf/features/search/models/resource.entity';
import { ResourceType } from '@osf/features/search/models/resource-type.enum';

export const resources: Resource[] = [
  {
    id: 'https://osf.io/wrfgp',
    resourceType: ResourceType.File,
    dateCreated: new Date('2025-01-10'),
    dateModified: new Date('2025-01-14'),
    creators: [
      {
        id: 'https://osf.io/a6t2x',
        name: 'Lívia Rodrigues de Lima Pires',
      },
    ],
    fileName: 'dadosAnalisados.rds',
    from: {
      id: 'https://osf.io/e86jf',
      name: 'Tese',
    },
  },
  {
    id: 'https://osf.io/4crzf',
    resourceType: ResourceType.Project,
    dateCreated: new Date('2025-01-15'),
    dateModified: new Date('2025-01-18'),
    creators: [
      {
        id: 'https://osf.io/4fy2t',
        name: 'Jane Simpson',
      },
      {
        id: 'https://osf.io/5jv47',
        name: 'Wendy Francis',
      },
      {
        id: 'https://osf.io/6a5yb',
        name: 'Daniel Wadsworth',
      },
      {
        id: 'https://osf.io/6g7nc',
        name: 'Kristen Tulloch',
      },
      {
        id: 'https://osf.io/7a3tm',
        name: 'Dr Tamara Sysak',
      },
      {
        id: 'https://osf.io/b8tvg',
        name: 'PJ Humphreys',
      },
      {
        id: 'https://osf.io/n2hyv',
        name: 'Alison Craswell',
      },
      {
        id: 'https://osf.io/qtnc8',
        name: 'Apil Gurung',
      },
      {
        id: 'https://osf.io/qvuw6',
        name: 'Karen Watson',
      },
      {
        id: 'https://osf.io/zwu3t',
        name: 'Helen Szabo',
      },
    ],
    title:
      'Intergenerational community home sharing for older adults and university students: A scoping review protocol.',
    description:
      'The objective of this scoping review is to review programs designed to facilitate matches between older adults residing within the community and university students. This protocol provides an overview of the topic, justification for and methods to be implemented in the conduct and reporting of the scoping review.',
  },
  {
    id: 'https://osf.io/pgmhr',
    resourceType: ResourceType.File,
    dateCreated: new Date('2025-01-17'),
    dateModified: new Date('2025-01-17'),
    creators: [{ id: 'https://osf.io/65nk7', name: 'Aline Miranda Ferreira' }],
    fileName: 'Scoping review protocol.pdf',
    license: 'MIT License',
    from: {
      id: 'https://osf.io/4wks9',
      name: 'Instruments for Measuring Pain, Functionality, and Quality of Life Following Knee Fractures: A Scoping Review',
    },
  },
  {
    id: 'https://osf.io/f7h5v',
    resourceType: ResourceType.File,
    dateCreated: new Date('2025-01-29'),
    dateModified: new Date('2025-01-29'),
    creators: [{ id: 'https://osf.io/d7rtw', name: 'David P. Goldenberg' }],
    fileName: 'PCB.zip',
    from: {
      id: 'https://osf.io/qs7r9',
      name: 'Design Files',
    },
  },
  {
    id: 'https://osf.io/3ua54',
    resourceType: ResourceType.Project,
    dateCreated: new Date('2025-03-16'),
    dateModified: new Date('2025-03-16'),
    creators: [{ id: 'https://osf.io/uby48', name: 'Aadit Nair Sajeev' }],
    title:
      'Unemployment of Locals in Kochi due to the Augmented Influx of Migrant Workers',
    description:
      'This project page includes supplementals like interview transcript for a case study into the unemployment of locals due to increasing influx of migrant workers into the state.',
  },
  {
    id: 'https://osf.io/xy9qn',
    resourceType: ResourceType.Project,
    dateCreated: new Date('2025-03-16'),
    dateModified: new Date('2025-03-16'),
    creators: [
      {
        id: 'https://osf.io/x87gf',
        name: 'Doctor Jack Samuel Egerton MSci EngD',
      },
    ],
    title: 'Stone functions (tetration)',
  },
  {
    id: 'https://osf.io/cpm64',
    resourceType: ResourceType.Registration,
    dateCreated: new Date('2025-01-10'),
    dateModified: new Date('2025-01-10'),
    creators: [
      {
        id: 'https://osf.io/4fy2t',
        name: 'Simran Khanna',
      },
      {
        id: 'https://osf.io/5jv47',
        name: 'Devika Shenoy',
      },
      {
        id: 'https://osf.io/6a5yb',
        name: 'Steph Hendren',
      },
      {
        id: 'https://osf.io/6g7nc',
        name: 'Christian Zirbes',
      },
      {
        id: 'https://osf.io/7a3tm',
        name: 'Anthony Catanzano',
      },
      {
        id: 'https://osf.io/b8tvg',
        name: 'Rachelle Shao',
      },
      {
        id: 'https://osf.io/n2hyv',
        name: 'Sofiu Ogunbiyi',
      },
      {
        id: 'https://osf.io/qtnc8',
        name: 'Evelyn Hunter',
      },
      {
        id: 'https://osf.io/qvuw6',
        name: 'Katie Radulovacki',
      },
      {
        id: 'https://osf.io/zwu3t',
        name: 'Muhamed Sanneh',
      },
    ],
    title:
      'A Scoping Review and Meta-analysis Exploring the Associations between Socioeconomic Identity and Management of Pediatric Extremity Fracture',
    description:
      'The incidence and management of extremity fractures in pediatric patients can be influenced by social and financial deprivation. Previous studies have highlighted that the social determinants of health, such as socioeconomic status, race, and insurance type, are independently associated with the incidence of pediatric fractures . [1, 2] This underscores the need to understand how these factors specifically affect fracture management in pediatric populations.\n\nIn addition to incidence, socioeconomic status has been shown to impact the timing and type of treatment for fractures. Vazquez et al. demonstrated that adolescents from poor socioeconomic backgrounds were more likely to experience delayed surgical fixation of femoral fractures, which was associated with worse outcomes, including longer hospital stays and higher healthcare costs.[2] Similarly, Evans et al. reported that children from socially deprived areas had worse perceived function and pain outcomes after upper extremity fractures, even after receiving orthopedic treatment.[3] These findings suggest that social deprivation not only affects initial access to care but also influences recovery and long-term outcomes.\n\nThe proposed scoping review and meta-analysis will systematically evaluate the existing literature to map out the extent and nature of the impact of social and financial deprivation on extremity fracture management in pediatric patients. By including a wide range of sociodemographic variables and outcomes, this review aims to provide a comprehensive understanding of the disparities in fracture care. This will inform future research and policy-making to address these inequities and improve healthcare delivery for socially and economically disadvantaged pediatric populations.\n\n[1] Dy CJ, Lyman S, Do HT, Fabricant PD, Marx RG, Green DW. Socioeconomic factors are associated with frequency of repeat emergency department visits for pediatric closed fractures. J Pediatr Orthop. 2014;34(5):548-551. doi:10.1097/BPO.0000000000000143\n[2] Ramaesh R, Clement ND, Rennie L, Court-Brown C, Gaston MS. Social deprivation as a risk factor for fractures in childhood. Bone Joint J. 2015;97-B(2):240-245. doi:10.1302/0301-620X.97B2.34057\n[3] Vazquez S, Dominguez JF, Jacoby M, et al. Poor socioeconomic status is associated with delayed femoral fracture fixation in adolescent patients. Injury. 2023;54(12):111128. doi:10.1016/j.injury.2023.111128',
    license: 'No license',
    publisher: {
      id: 'https://osf.io/registries/osf',
      name: 'OSF Registries',
    },
    registrationTemplate: 'Generalized Systematic Review Registration',
    doi: 'https://doi.org/10.17605/OSF.IO/CPM64',
  },
  {
    id: 'https://osf.io/8tk45',
    resourceType: ResourceType.Registration,
    dateCreated: new Date('2025-03-06'),
    dateModified: new Date('2025-03-06'),
    creators: [
      {
        id: 'https://osf.io/45kpt',
        name: 'Laura A. King',
      },
      {
        id: 'https://osf.io/cuqrk',
        name: 'Erica A. Holberg',
      },
    ],
    title: 'Consequentialist Criteria: Money x Effort (Between)',
    description:
      "This is the first of two studies aimed at testing whether the effect of amount of money raised for a good cause is present in within person comparisons, but null when utilizing a between person design. In previous studies, we have found that success in achieving an agent's morally good aim and high cost to agent for doing the right thing are salient to moral evaluators when the explicit contrast to failure or low cost is made (within person), but not particularly salient to moral evaluation when the explicit contrast is not drawn (between person). In this study, we are interested to determine the relative presence and strength of amount of money raised (a consequentialist criterion for moral evaluation) and effort put forth (a non-consequentialist moral criterion centered on the agent's will) when this is not explicitly contrasted because using a between-person design. In a pilot study, we found no effect of money upon moral goodness. There was an effect of money upon effort for the low condition ($50). We want to see how results are altered if we add an explicit factor for effort. Does amount of money have null effect upon perceived moral goodness? Does effort have a larger effect upon perceived moral goodness than amount of money raised? \n\nParticipants will read scenarios reflecting a 3 (money: extremely high vs. high vs. low) x 3 (effort: high vs. no mention vs. low) design.  In all 9 scenarios, participants will rate the moral goodness of a person who raises money for and then runs in a 5K for a good cause, where the conditions vary as described above. They also will answer how likely it is that the target would undertake a similar volunteer commitment in the future.",
    publisher: {
      id: 'https://osf.io/registries/osf',
      name: 'OSF Registries',
    },
    registrationTemplate: 'OSF Preregistration',
    license: 'No license',
    doi: 'https://doi.org/10.17605/OSF.IO/8TK45',
  },
  {
    id: 'https://osf.io/wa6yf',
    resourceType: ResourceType.File,
    dateCreated: new Date('2025-01-14'),
    dateModified: new Date('2025-01-14'),
    creators: [
      {
        id: 'https://osf.io/6nkxv',
        name: 'Kari-Anne B. Næss',
      },
      {
        id: 'https://osf.io/b2g9q',
        name: 'Frida Johanne Holmen ',
      },
      {
        id: 'https://osf.io/j6hd5',
        name: 'Thormod Idsøe',
      },
    ],
    from: {
      id: 'https://osf.io/tbzv6',
      name: 'A Cross-sectional Study of Inference-making Comparing First- and Second Language Learners in Early Childhood Education and Care',
    },
    fileName: 'Model_FH_prereg_140125.pdf',
    license: 'No license',
  },
  {
    id: 'https://osf.io/4hg87',
    resourceType: ResourceType.ProjectComponent,
    dateCreated: new Date('2025-01-04'),
    dateModified: new Date('2025-01-04'),
    creators: [
      {
        id: 'https://osf.io/2x5kc',
        name: 'Bowen Wang-Kildegaard',
      },
    ],
    title: 'Dataset and Codes',
  },
  {
    id: 'https://osf.io/87vyr',
    resourceType: ResourceType.Preprint,
    dateCreated: new Date('2025-02-20'),
    dateModified: new Date('2025-02-20'),
    creators: [
      {
        id: 'https://osf.io/2x5kc',
        name: 'Eric L. Olson',
      },
    ],
    title: 'Evaluative Judgment Across Domains',
    description:
      'Keberadaan suatu organisme pada suatu tempat dipengaruhi oleh faktor lingkungan dan makanan. Ketersediaan makanan dengan kualitas yang cocok dan kuantitas yang ukup bagi suatu organisme akan meningkatkan populasi cepat. Sebaliknya jika keadaan tersebut tidak mendukung maka akan dipastikan bahwa organisme tersebut akan menurun. Sedangkan faktor abiotik meliputi suhu, kelembaban, cahaya, curah hujan, dan angin. Suhu mempengaruhi aktivitas serangga serta perkembangannya. Serangga juga tertarik pada gelombang cahaya tertentu. Serangga ada yang menerima intensitas cahaya yang tinggi dan aktif pada siang hari (diurnal) dan serangga ada yang aktif menerima intensitas cahaya rendah pada malam hari (nokturnal). Metode yang digunakan yaitu metode Light trap. Hail yang didapatkan bahwa komponen lingkungan (biotik dan abiotik) akan mempengaruhi kelimpahan dan keanekaragaman spesies pada suatu tempat sehingga tingginya kelimpahan individu tiap jenis dapat dipakai untuk menilai kualitas suatu habitat. Sehingga tidak semua serangga yang aktif pada siang hari tidak dapat aktif di malam hari karena efek adanya sinar tergantung sepenuhnya pada kondisi temperature dan kelembaban disekitar.',
    provider: {
      id: 'https://osf.io/preprints/osf',
      name: 'Open Science Framework',
    },
    conflictOfInterestResponse: 'Author asserted no Conflict of Interest',
    license: 'No License',
    doi: 'https://doi.org/10.31227/osf.io/fcs5r',
  },
  {
    id: 'https://osf.io/87vyr',
    resourceType: ResourceType.Preprint,
    dateCreated: new Date('2025-02-20'),
    dateModified: new Date('2025-02-20'),
    creators: [
      {
        id: 'https://osf.io/2x5kc',
        name: 'Fitha Kaamiliyaa Hamka',
      },
    ],
    title:
      'Identifikasi Serangga Nokturnal di Bukit Samata Kabupaten Gowa, Sulawesi Selatan',
    description:
      'Keberadaan suatu organisme pada suatu tempat dipengaruhi oleh faktor lingkungan dan makanan. Ketersediaan makanan dengan kualitas yang cocok dan kuantitas yang ukup bagi suatu organisme akan meningkatkan populasi cepat. Sebaliknya jika keadaan tersebut tidak mendukung maka akan dipastikan bahwa organisme tersebut akan menurun. Sedangkan faktor abiotik meliputi suhu, kelembaban, cahaya, curah hujan, dan angin. Suhu mempengaruhi aktivitas serangga serta perkembangannya. Serangga juga tertarik pada gelombang cahaya tertentu. Serangga ada yang menerima intensitas cahaya yang tinggi dan aktif pada siang hari (diurnal) dan serangga ada yang aktif menerima intensitas cahaya rendah pada malam hari (nokturnal). Metode yang digunakan yaitu metode Light trap. Hail yang didapatkan bahwa komponen lingkungan (biotik dan abiotik) akan mempengaruhi kelimpahan dan keanekaragaman spesies pada suatu tempat sehingga tingginya kelimpahan individu tiap jenis dapat dipakai untuk menilai kualitas suatu habitat. Sehingga tidak semua serangga yang aktif pada siang hari tidak dapat aktif di malam hari karena efek adanya sinar tergantung sepenuhnya pada kondisi temperature dan kelembaban disekitar.',
    provider: {
      id: 'https://osf.io/preprints/osf',
      name: 'Open Science Framework',
    },
    conflictOfInterestResponse: 'Author asserted no Conflict of Interest',
    license: 'No License',
    doi: 'https://doi.org/10.31234/osf.io/7mgkd',
  },
  {
    id: 'https://osf.io/cegxv',
    resourceType: ResourceType.User,
    title: 'Amelia Jamison',
    publicProjects: 2,
    publicRegistrations: 0,
    publicPreprints: 0,
  },
  {
    id: 'https://osf.io/cegxv',
    resourceType: ResourceType.User,
    title: 'Cristal Alvarez',
    publicProjects: 2,
    publicRegistrations: 0,
    publicPreprints: 0,
    orcid: 'https://orcid.org/0000-0003-2697-7146',
  },
  {
    id: 'https://osf.io/cegxv',
    resourceType: ResourceType.User,
    title: 'Rohini Ganjoo',
    publicProjects: 16,
    publicRegistrations: 6,
    publicPreprints: 3,
    orcid: 'https://orcid.org/0000-0003-2697-7146',
    employment: 'University of Turku',
    education: 'University of Turku',
  },
];
