export type IconsId =
  | 'withdrawn'
  | 'warning'
  | 'warning-sign'
  | 'upload'
  | 'trash'
  | 'support'
  | 'supplements'
  | 'sort'
  | 'sort-desc'
  | 'sort-asc'
  | 'sort-asc-grey'
  | 'share'
  | 'settings'
  | 'search'
  | 'search-2'
  | 'rejected'
  | 'registries'
  | 'quotes'
  | 'profile'
  | 'preprints'
  | 'plus'
  | 'pending'
  | 'pdf'
  | 'papers'
  | 'padlock'
  | 'padlock-unlock'
  | 'my-projects'
  | 'minus'
  | 'menu'
  | 'meetings'
  | 'materials'
  | 'list'
  | 'link'
  | 'last'
  | 'institutions'
  | 'institution'
  | 'information'
  | 'image'
  | 'home'
  | 'home-2'
  | 'help'
  | 'folder'
  | 'first'
  | 'filter'
  | 'eye-view'
  | 'eye-hidden'
  | 'email'
  | 'duplicate'
  | 'download'
  | 'double-arrow-left'
  | 'dots'
  | 'donate'
  | 'doc'
  | 'diagram'
  | 'data'
  | 'customize'
  | 'cos-shield'
  | 'copy'
  | 'contact'
  | 'collections'
  | 'code'
  | 'close'
  | 'chevron-right'
  | 'chevron-left'
  | 'calendar-silhouette'
  | 'bookmark'
  | 'bookmark-fill'
  | 'arrow'
  | 'arrow-left'
  | 'arrow-down'
  | 'accepted';

export type IconsKey =
  | 'Withdrawn'
  | 'Warning'
  | 'WarningSign'
  | 'Upload'
  | 'Trash'
  | 'Support'
  | 'Supplements'
  | 'Sort'
  | 'SortDesc'
  | 'SortAsc'
  | 'SortAscGrey'
  | 'Share'
  | 'Settings'
  | 'Search'
  | 'Search2'
  | 'Rejected'
  | 'Registries'
  | 'Quotes'
  | 'Profile'
  | 'Preprints'
  | 'Plus'
  | 'Pending'
  | 'Pdf'
  | 'Papers'
  | 'Padlock'
  | 'PadlockUnlock'
  | 'MyProjects'
  | 'Minus'
  | 'Menu'
  | 'Meetings'
  | 'Materials'
  | 'List'
  | 'Link'
  | 'Last'
  | 'Institutions'
  | 'Institution'
  | 'Information'
  | 'Image'
  | 'Home'
  | 'Home2'
  | 'Help'
  | 'Folder'
  | 'First'
  | 'Filter'
  | 'EyeView'
  | 'EyeHidden'
  | 'Email'
  | 'Duplicate'
  | 'Download'
  | 'DoubleArrowLeft'
  | 'Dots'
  | 'Donate'
  | 'Doc'
  | 'Diagram'
  | 'Data'
  | 'Customize'
  | 'CosShield'
  | 'Copy'
  | 'Contact'
  | 'Collections'
  | 'Code'
  | 'Close'
  | 'ChevronRight'
  | 'ChevronLeft'
  | 'CalendarSilhouette'
  | 'Bookmark'
  | 'BookmarkFill'
  | 'Arrow'
  | 'ArrowLeft'
  | 'ArrowDown'
  | 'Accepted';

export enum Icons {
  Withdrawn = 'withdrawn',
  Warning = 'warning',
  WarningSign = 'warning-sign',
  Upload = 'upload',
  Trash = 'trash',
  Support = 'support',
  Supplements = 'supplements',
  Sort = 'sort',
  SortDesc = 'sort-desc',
  SortAsc = 'sort-asc',
  SortAscGrey = 'sort-asc-grey',
  Share = 'share',
  Settings = 'settings',
  Search = 'search',
  Search2 = 'search-2',
  Rejected = 'rejected',
  Registries = 'registries',
  Quotes = 'quotes',
  Profile = 'profile',
  Preprints = 'preprints',
  Plus = 'plus',
  Pending = 'pending',
  Pdf = 'pdf',
  Papers = 'papers',
  Padlock = 'padlock',
  PadlockUnlock = 'padlock-unlock',
  MyProjects = 'my-projects',
  Minus = 'minus',
  Menu = 'menu',
  Meetings = 'meetings',
  Materials = 'materials',
  List = 'list',
  Link = 'link',
  Last = 'last',
  Institutions = 'institutions',
  Institution = 'institution',
  Information = 'information',
  Image = 'image',
  Home = 'home',
  Home2 = 'home-2',
  Help = 'help',
  Folder = 'folder',
  First = 'first',
  Filter = 'filter',
  EyeView = 'eye-view',
  EyeHidden = 'eye-hidden',
  Email = 'email',
  Duplicate = 'duplicate',
  Download = 'download',
  DoubleArrowLeft = 'double-arrow-left',
  Dots = 'dots',
  Donate = 'donate',
  Doc = 'doc',
  Diagram = 'diagram',
  Data = 'data',
  Customize = 'customize',
  CosShield = 'cos-shield',
  Copy = 'copy',
  Contact = 'contact',
  Collections = 'collections',
  Code = 'code',
  Close = 'close',
  ChevronRight = 'chevron-right',
  ChevronLeft = 'chevron-left',
  CalendarSilhouette = 'calendar-silhouette',
  Bookmark = 'bookmark',
  BookmarkFill = 'bookmark-fill',
  Arrow = 'arrow',
  ArrowLeft = 'arrow-left',
  ArrowDown = 'arrow-down',
  Accepted = 'accepted',
}

export const ICONS_CODEPOINTS: Record<Icons, string> = {
  [Icons.Withdrawn]: '61697',
  [Icons.Warning]: '61698',
  [Icons.WarningSign]: '61699',
  [Icons.Upload]: '61700',
  [Icons.Trash]: '61701',
  [Icons.Support]: '61702',
  [Icons.Supplements]: '61703',
  [Icons.Sort]: '61704',
  [Icons.SortDesc]: '61705',
  [Icons.SortAsc]: '61706',
  [Icons.SortAscGrey]: '61707',
  [Icons.Share]: '61708',
  [Icons.Settings]: '61709',
  [Icons.Search]: '61710',
  [Icons.Search2]: '61711',
  [Icons.Rejected]: '61712',
  [Icons.Registries]: '61713',
  [Icons.Quotes]: '61714',
  [Icons.Profile]: '61715',
  [Icons.Preprints]: '61716',
  [Icons.Plus]: '61717',
  [Icons.Pending]: '61718',
  [Icons.Pdf]: '61719',
  [Icons.Papers]: '61720',
  [Icons.Padlock]: '61721',
  [Icons.PadlockUnlock]: '61722',
  [Icons.MyProjects]: '61723',
  [Icons.Minus]: '61724',
  [Icons.Menu]: '61725',
  [Icons.Meetings]: '61726',
  [Icons.Materials]: '61727',
  [Icons.List]: '61728',
  [Icons.Link]: '61729',
  [Icons.Last]: '61730',
  [Icons.Institutions]: '61731',
  [Icons.Institution]: '61732',
  [Icons.Information]: '61733',
  [Icons.Image]: '61734',
  [Icons.Home]: '61735',
  [Icons.Home2]: '61736',
  [Icons.Help]: '61737',
  [Icons.Folder]: '61738',
  [Icons.First]: '61739',
  [Icons.Filter]: '61740',
  [Icons.EyeView]: '61741',
  [Icons.EyeHidden]: '61742',
  [Icons.Email]: '61743',
  [Icons.Duplicate]: '61744',
  [Icons.Download]: '61745',
  [Icons.DoubleArrowLeft]: '61746',
  [Icons.Dots]: '61747',
  [Icons.Donate]: '61748',
  [Icons.Doc]: '61749',
  [Icons.Diagram]: '61750',
  [Icons.Data]: '61751',
  [Icons.Customize]: '61752',
  [Icons.CosShield]: '61753',
  [Icons.Copy]: '61754',
  [Icons.Contact]: '61755',
  [Icons.Collections]: '61756',
  [Icons.Code]: '61757',
  [Icons.Close]: '61758',
  [Icons.ChevronRight]: '61759',
  [Icons.ChevronLeft]: '61760',
  [Icons.CalendarSilhouette]: '61761',
  [Icons.Bookmark]: '61762',
  [Icons.BookmarkFill]: '61763',
  [Icons.Arrow]: '61764',
  [Icons.ArrowLeft]: '61765',
  [Icons.ArrowDown]: '61766',
  [Icons.Accepted]: '61767',
};
