export interface ProjectStaffProps {
  id: string;
  name: string;
  time: number;
  start: string;
  end: string;
  billingType: string;
}

export interface ProjectProps {
  id: string;
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