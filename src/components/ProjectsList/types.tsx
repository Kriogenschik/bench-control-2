export interface ProjectStaffProps {
  id: number;
  name: string;
  time: number;
  start: string;
  end: string;
  billingType: string;
}

export interface ProjectProps {
  id: number;
  name: string;
  lead: ProjectStaffProps;
  ba: ProjectStaffProps;
  pm: ProjectStaffProps;
  start: string;
  end: string;
  devs: Array<ProjectStaffProps>;
  qas: Array<ProjectStaffProps>;
  isActive: boolean;
}