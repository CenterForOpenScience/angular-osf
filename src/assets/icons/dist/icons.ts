export type IconsId =
  | 'withdrawn'
  | 'warning'
  | 'warning-sign'
  | 'upload'
  | 'trash'
  | 'support'
  | 'supplements'
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
  [Icons.SortDesc]: '61704',
  [Icons.SortAsc]: '61705',
  [Icons.SortAscGrey]: '61706',
  [Icons.Share]: '61707',
  [Icons.Settings]: '61708',
  [Icons.Search]: '61709',
  [Icons.Search2]: '61710',
  [Icons.Rejected]: '61711',
  [Icons.Registries]: '61712',
  [Icons.Quotes]: '61713',
  [Icons.Profile]: '61714',
  [Icons.Preprints]: '61715',
  [Icons.Plus]: '61716',
  [Icons.Pending]: '61717',
  [Icons.Pdf]: '61718',
  [Icons.Papers]: '61719',
  [Icons.Padlock]: '61720',
  [Icons.PadlockUnlock]: '61721',
  [Icons.MyProjects]: '61722',
  [Icons.Minus]: '61723',
  [Icons.Menu]: '61724',
  [Icons.Meetings]: '61725',
  [Icons.Materials]: '61726',
  [Icons.List]: '61727',
  [Icons.Link]: '61728',
  [Icons.Last]: '61729',
  [Icons.Institutions]: '61730',
  [Icons.Institution]: '61731',
  [Icons.Information]: '61732',
  [Icons.Image]: '61733',
  [Icons.Home]: '61734',
  [Icons.Home2]: '61735',
  [Icons.Help]: '61736',
  [Icons.Folder]: '61737',
  [Icons.First]: '61738',
  [Icons.Filter]: '61739',
  [Icons.EyeView]: '61740',
  [Icons.EyeHidden]: '61741',
  [Icons.Email]: '61742',
  [Icons.Duplicate]: '61743',
  [Icons.Download]: '61744',
  [Icons.DoubleArrowLeft]: '61745',
  [Icons.Dots]: '61746',
  [Icons.Donate]: '61747',
  [Icons.Doc]: '61748',
  [Icons.Diagram]: '61749',
  [Icons.Data]: '61750',
  [Icons.Customize]: '61751',
  [Icons.Copy]: '61752',
  [Icons.Contact]: '61753',
  [Icons.Collections]: '61754',
  [Icons.Code]: '61755',
  [Icons.Close]: '61756',
  [Icons.ChevronRight]: '61757',
  [Icons.ChevronLeft]: '61758',
  [Icons.CalendarSilhouette]: '61759',
  [Icons.Bookmark]: '61760',
  [Icons.BookmarkFill]: '61761',
  [Icons.Arrow]: '61762',
  [Icons.ArrowLeft]: '61763',
  [Icons.ArrowDown]: '61764',
  [Icons.Accepted]: '61765',
};
