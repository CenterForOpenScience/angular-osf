export interface ShareableContent {
  id: string;
  title: string;
  description?: string;
  url: string;
}

export interface SocialShareLinks {
  email: string;
  twitter: string;
  facebook: string;
  linkedIn: string;
  mastodon: string;
  bluesky: string;
}
