export interface Term {
  label: string;
  supportedFeature: string;
  storage: {
    true: string;
    false: string;
  };
  citation?: {
    partial?: string;
    false?: string;
  };
}
