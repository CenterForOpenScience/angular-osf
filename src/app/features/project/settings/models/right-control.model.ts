export type RightControl =
  | {
      type: 'dropdown';
      label?: string;
      value: string;
      options: { label: string; value: string }[];
      onChange?: (value: string) => void;
    }
  | {
      type: 'text';
      label?: string;
      value: string;
    };
