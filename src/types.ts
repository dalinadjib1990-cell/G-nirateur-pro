export interface TeacherInfo {
  firstName: string;
  lastName: string;
  school: string;
  phase: string;
  level: string;
  subject: string;
}

export type GenerationType = 'memo' | 'test' | 'series' | 'summary' | 'visual' | 'cutout_start' | 'cutout_learning' | 'cutout_integration';

export interface Exercise {
  id: string;
  section: string;
  competencies: string[];
}

export interface IntegrationModule {
  id: string;
  title: string;
  competencies: string[];
}

export interface SubjectInfo {
  section?: string;
  domain?: string;
  content?: string;
  exercises?: Exercise[];
  hasIntegrationSituation?: boolean;
  integrationSections?: string;
  integrationCompetencies?: string;
  integrationPrompt?: string;
  integrationModules?: IntegrationModule[];
  includeSolution?: boolean;
  examType?: string;
  term?: string;
  duration?: string;
}
