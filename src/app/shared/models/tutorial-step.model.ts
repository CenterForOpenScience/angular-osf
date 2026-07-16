export interface TutorialStep {
  title: string;
  description: string;
  position: Position;
  mobilePosition: Position;
}

interface Position {
  top: string;
  left: string;
}
