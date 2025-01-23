export interface Script {
  _id: string;
  userId: string;
  topic: string;
  description: string;
  keywords: string[];
  tone: string;
  duration: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface GeneratedScript {
  content: string;
  metadata: {
    topic: string;
    description: string;
    keywords: string[];
    tone: string;
    duration: string;
  };
} 