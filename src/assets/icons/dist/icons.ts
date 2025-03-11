export type IconsId =
  | 'x'
  | 'website'
  | 'warning'
  | 'upload'
  | 'twitter'
  | 'trash'
  | 'support'
  | 'supplements'
  | 'sort-3'
  | 'sort-2'
  | 'sort-1'
  | 'settings'
  | 'search'
  | 'quotes'
  | 'question-mark'
  | 'publish'
  | 'profile'
  | 'plus'
  | 'pdf'
  | 'papers'
  | 'padlock'
  | 'padlock-unlock'
  | 'orcid'
  | 'my-projects'
  | 'minus'
  | 'meetings'
  | 'materials'
  | 'list'
  | 'linkedin'
  | 'institutions'
  | 'information'
  | 'image'
  | 'hosting'
  | 'home'
  | 'group'
  | 'github'
  | 'folder'
  | 'filter'
  | 'facebook'
  | 'eye-view'
  | 'eye-hidden'
  | 'email'
  | 'download'
  | 'double-arrow-left'
  | 'dots'
  | 'donate'
  | 'doc'
  | 'design'
  | 'data'
  | 'copy'
  | 'collections'
  | 'collect'
  | 'code'
  | 'calendar-silhouette'
  | 'arrow-down';

export type IconsKey =
  | 'X'
  | 'Website'
  | 'Warning'
  | 'Upload'
  | 'Twitter'
  | 'Trash'
  | 'Support'
  | 'Supplements'
  | 'Sort3'
  | 'Sort2'
  | 'Sort1'
  | 'Settings'
  | 'Search'
  | 'Quotes'
  | 'QuestionMark'
  | 'Publish'
  | 'Profile'
  | 'Plus'
  | 'Pdf'
  | 'Papers'
  | 'Padlock'
  | 'PadlockUnlock'
  | 'Orcid'
  | 'MyProjects'
  | 'Minus'
  | 'Meetings'
  | 'Materials'
  | 'List'
  | 'Linkedin'
  | 'Institutions'
  | 'Information'
  | 'Image'
  | 'Hosting'
  | 'Home'
  | 'Group'
  | 'Github'
  | 'Folder'
  | 'Filter'
  | 'Facebook'
  | 'EyeView'
  | 'EyeHidden'
  | 'Email'
  | 'Download'
  | 'DoubleArrowLeft'
  | 'Dots'
  | 'Donate'
  | 'Doc'
  | 'Design'
  | 'Data'
  | 'Copy'
  | 'Collections'
  | 'Collect'
  | 'Code'
  | 'CalendarSilhouette'
  | 'ArrowDown';

export enum Icons {
  X = 'x',
  Website = 'website',
  Warning = 'warning',
  Upload = 'upload',
  Twitter = 'twitter',
  Trash = 'trash',
  Support = 'support',
  Supplements = 'supplements',
  Sort3 = 'sort-3',
  Sort2 = 'sort-2',
  Sort1 = 'sort-1',
  Settings = 'settings',
  Search = 'search',
  Quotes = 'quotes',
  QuestionMark = 'question-mark',
  Publish = 'publish',
  Profile = 'profile',
  Plus = 'plus',
  Pdf = 'pdf',
  Papers = 'papers',
  Padlock = 'padlock',
  PadlockUnlock = 'padlock-unlock',
  Orcid = 'orcid',
  MyProjects = 'my-projects',
  Minus = 'minus',
  Meetings = 'meetings',
  Materials = 'materials',
  List = 'list',
  Linkedin = 'linkedin',
  Institutions = 'institutions',
  Information = 'information',
  Image = 'image',
  Hosting = 'hosting',
  Home = 'home',
  Group = 'group',
  Github = 'github',
  Folder = 'folder',
  Filter = 'filter',
  Facebook = 'facebook',
  EyeView = 'eye-view',
  EyeHidden = 'eye-hidden',
  Email = 'email',
  Download = 'download',
  DoubleArrowLeft = 'double-arrow-left',
  Dots = 'dots',
  Donate = 'donate',
  Doc = 'doc',
  Design = 'design',
  Data = 'data',
  Copy = 'copy',
  Collections = 'collections',
  Collect = 'collect',
  Code = 'code',
  CalendarSilhouette = 'calendar-silhouette',
  ArrowDown = 'arrow-down',
}

export const ICONS_CODEPOINTS: Record<Icons, string> = {
  [Icons.X]: '61697',
  [Icons.Website]: '61698',
  [Icons.Warning]: '61699',
  [Icons.Upload]: '61700',
  [Icons.Twitter]: '61701',
  [Icons.Trash]: '61702',
  [Icons.Support]: '61703',
  [Icons.Supplements]: '61704',
  [Icons.Sort3]: '61705',
  [Icons.Sort2]: '61706',
  [Icons.Sort1]: '61707',
  [Icons.Settings]: '61708',
  [Icons.Search]: '61709',
  [Icons.Quotes]: '61710',
  [Icons.QuestionMark]: '61711',
  [Icons.Publish]: '61712',
  [Icons.Profile]: '61713',
  [Icons.Plus]: '61714',
  [Icons.Pdf]: '61715',
  [Icons.Papers]: '61716',
  [Icons.Padlock]: '61717',
  [Icons.PadlockUnlock]: '61718',
  [Icons.Orcid]: '61719',
  [Icons.MyProjects]: '61720',
  [Icons.Minus]: '61721',
  [Icons.Meetings]: '61722',
  [Icons.Materials]: '61723',
  [Icons.List]: '61724',
  [Icons.Linkedin]: '61725',
  [Icons.Institutions]: '61726',
  [Icons.Information]: '61727',
  [Icons.Image]: '61728',
  [Icons.Hosting]: '61729',
  [Icons.Home]: '61730',
  [Icons.Group]: '61731',
  [Icons.Github]: '61732',
  [Icons.Folder]: '61733',
  [Icons.Filter]: '61734',
  [Icons.Facebook]: '61735',
  [Icons.EyeView]: '61736',
  [Icons.EyeHidden]: '61737',
  [Icons.Email]: '61738',
  [Icons.Download]: '61739',
  [Icons.DoubleArrowLeft]: '61740',
  [Icons.Dots]: '61741',
  [Icons.Donate]: '61742',
  [Icons.Doc]: '61743',
  [Icons.Design]: '61744',
  [Icons.Data]: '61745',
  [Icons.Copy]: '61746',
  [Icons.Collections]: '61747',
  [Icons.Collect]: '61748',
  [Icons.Code]: '61749',
  [Icons.CalendarSilhouette]: '61750',
  [Icons.ArrowDown]: '61751',
};
