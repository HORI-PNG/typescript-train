export type LessonSection = {
  heading: string;
  text: string;
  code?: string;
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  sections: LessonSection[];
  challenge: string;
};

export type Progress = {
  completedLessonIds: string[];
};
