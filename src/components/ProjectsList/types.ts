export interface ProjectStaffProps {
  id: number;
  name: string;
  time: number;
  start: string;
  end: string;
  billingType: string;
}

export interface ProjectProps extends CreateProjectProps {
  id: number;
}

export interface CreateProjectProps {
  name: string;
  lead: Partial<ProjectStaffProps>;
  ba: Partial<ProjectStaffProps>;
  pm: Partial<ProjectStaffProps>;
  start: string;
  end: string;
  devs: Array<ProjectStaffProps>;
  qas: Array<ProjectStaffProps>;
  isActive: boolean;
}