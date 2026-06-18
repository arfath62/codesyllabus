export interface Floor {
  number: number;
  title: string;
  problem: string;
  starter: string;
  testCode: string;
  theory: string;
  analogy: string;
  difficulty: "FOUNDATIONS" | "DYNAMICS" | "ARCHITECT_SYSTEMS";
}

export interface LibraryReference {
  name: string;
  category: string;
  purpose: string;
  example: string;
  docUrl?: string;
}

export interface City {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  description: string;
  floors: Floor[];
  libraryReferences?: LibraryReference[];
}

export interface UserStats {
  level: number;
  xp: number;
  maxXp: number;
  gold: number;
  completedFloors: Record<string, number>;
}

export interface GradingReport {
  success: boolean;
  executionOutput?: string;
  metrics: {
    linesOfCode: number;
    characterCount: number;
    commentCount: number;
    complexityRating: string;
  };
  feedback: {
    validationDetails: string;
    debuggerGuidance: string;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "mentor";
  text: string;
  timestamp: string;
}
