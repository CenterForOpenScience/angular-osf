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
  | 'share'
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
  | 'menu'
  | 'meetings'
  | 'materials'
  | 'list'
  | 'linkedin'
  | 'link'
  | 'institutions'
  | 'information'
  | 'image'
  | 'hosting'
  | 'home'
  | 'help'
  | 'group'
  | 'github'
  | 'fork'
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
  | 'close'
  | 'calendar-silhouette'
  | 'bookmark'
  | 'arrow'
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
  | 'Share'
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
  | 'Menu'
  | 'Meetings'
  | 'Materials'
  | 'List'
  | 'Linkedin'
  | 'Link'
  | 'Institutions'
  | 'Information'
  | 'Image'
  | 'Hosting'
  | 'Home'
  | 'Help'
  | 'Group'
  | 'Github'
  | 'Fork'
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
  | 'Close'
  | 'CalendarSilhouette'
  | 'Bookmark'
  | 'Arrow'
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
  Share = 'share',
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
  Menu = 'menu',
  Meetings = 'meetings',
  Materials = 'materials',
  List = 'list',
  Linkedin = 'linkedin',
  Link = 'link',
  Institutions = 'institutions',
  Information = 'information',
  Image = 'image',
  Hosting = 'hosting',
  Home = 'home',
  Help = 'help',
  Group = 'group',
  Github = 'github',
  Fork = 'fork',
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
  Close = 'close',
  CalendarSilhouette = 'calendar-silhouette',
  Bookmark = 'bookmark',
  Arrow = 'arrow',
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
  [Icons.Share]: '61708',
  [Icons.Settings]: '61709',
  [Icons.Search]: '61710',
  [Icons.Quotes]: '61711',
  [Icons.QuestionMark]: '61712',
  [Icons.Publish]: '61713',
  [Icons.Profile]: '61714',
  [Icons.Plus]: '61715',
  [Icons.Pdf]: '61716',
  [Icons.Papers]: '61717',
  [Icons.Padlock]: '61718',
  [Icons.PadlockUnlock]: '61719',
  [Icons.Orcid]: '61720',
  [Icons.MyProjects]: '61721',
  [Icons.Minus]: '61722',
  [Icons.Menu]: '61723',
  [Icons.Meetings]: '61724',
  [Icons.Materials]: '61725',
  [Icons.List]: '61726',
  [Icons.Linkedin]: '61727',
  [Icons.Link]: '61728',
  [Icons.Institutions]: '61729',
  [Icons.Information]: '61730',
  [Icons.Image]: '61731',
  [Icons.Hosting]: '61732',
  [Icons.Home]: '61733',
  [Icons.Help]: '61734',
  [Icons.Group]: '61735',
  [Icons.Github]: '61736',
  [Icons.Fork]: '61737',
  [Icons.Folder]: '61738',
  [Icons.Filter]: '61739',
  [Icons.Facebook]: '61740',
  [Icons.EyeView]: '61741',
  [Icons.EyeHidden]: '61742',
  [Icons.Email]: '61743',
  [Icons.Download]: '61744',
  [Icons.DoubleArrowLeft]: '61745',
  [Icons.Dots]: '61746',
  [Icons.Donate]: '61747',
  [Icons.Doc]: '61748',
  [Icons.Design]: '61749',
  [Icons.Data]: '61750',
  [Icons.Copy]: '61751',
  [Icons.Collections]: '61752',
  [Icons.Collect]: '61753',
  [Icons.Code]: '61754',
  [Icons.Close]: '61755',
  [Icons.CalendarSilhouette]: '61756',
  [Icons.Bookmark]: '61757',
  [Icons.Arrow]: '61758',
  [Icons.ArrowDown]: '61759',
};
