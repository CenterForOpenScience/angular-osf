import { SocialLinksModel } from './models';

export const socials: SocialLinksModel[] = [
  {
    id: 0,
    label: 'ResearcherID',
    address: 'http://researchers.com/rid/',
    placeholder: 'x-xxxx-xxxx',
    key: 'researcherId',
  },
  {
    id: 1,
    label: 'LinkedIn',
    address: 'https://linkedin.com/',
    placeholder: 'in/userID, profie/view?profileID, or pub/pubID',
    key: 'linkedIn',
  },
  {
    id: 2,
    label: 'ORCID',
    address: 'http://orcid.org/',
    placeholder: 'xxxx-xxxx-xxxx',
    key: 'orcid',
  },
  {
    id: 3,
    label: 'Twitter',
    address: '@',
    placeholder: 'twitterhandle',
    key: 'twitter',
  },
  {
    id: 4,
    label: 'GitHub',
    address: 'https://github.com/',
    placeholder: 'username',
    key: 'github',
  },
  {
    id: 5,
    label: 'ImpactStory',
    address: 'https://impactstory.org/u/',
    placeholder: 'profileID',
    key: 'impactStory',
  },
  {
    id: 6,
    label: 'Google Scholar',
    address: 'http://scholar.google.com/citations?user=',
    placeholder: 'profileID',
    key: 'scholar',
  },
  {
    id: 7,
    label: 'ResearchGate',
    address: 'https://researchgate.net/profile/',
    placeholder: 'profileID',
    key: 'researchGate',
  },
  {
    id: 8,
    label: 'Baidu Scholar',
    address: 'http://xueshu.baidu.com/scholarID/',
    placeholder: 'profileID',
    key: 'baiduScholar',
  },
  {
    id: 9,
    label: 'SSRN',
    address: 'http://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=',
    placeholder: 'profileID',
    key: 'ssrn',
  },
];
