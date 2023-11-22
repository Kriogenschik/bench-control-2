export interface OptionsProps {
  id: number;
  value: string;
  label: string;
  name: string;
}

export const roles: Array<OptionsProps> = [
  { id: 1, value: "DEV", label: "DEV", name: "Dev" },
  { id: 2, value: "QA", label: "QA", name: "QA" },
  { id: 3, value: "S", label: "S", name: "Sales" },
  { id: 4, value: "MP", label: "MP", name: "Markup" },
  { id: 5, value: "D", label: "D", name: "Design" },
  { id: 6, value: "BA", label: "BA", name: "BA" },
  { id: 7, value: "PM", label: "PM", name: "PM" },
];

export const stacks: Array<OptionsProps> = [
  { id: 1, value: "NET", label: "NET", name: ".Net" },
  { id: 2, value: "XM", label: "XM", name: "Xamarin/MAUI" },
  { id: 3, value: "M", label: "M", name: "MERN" },
  { id: 4, value: "MP", label: "MP", name: "Markup" },
  { id: 5, value: "D", label: "D", name: "Design" },
  { id: 6, value: "QA", label: "QA", name: "QA" },
  { id: 7, value: "BA", label: "BA", name: "BA" },
  { id: 8, value: "PM", label: "PM", name: "PM" },
];

export const exps: Array<OptionsProps> = [
  { id: 1, value: "VL", label: "VL", name: "Very low" },
  { id: 2, value: "L", label: "L", name: "Low" },
  { id: 3, value: "ML", label: "ML", name: "More than low" },
  { id: 4, value: "LM", label: "LM", name: "Less than medium" },
  { id: 5, value: "M", label: "M", name: "Medium" },
  { id: 6, value: "MM", label: "MM", name: "More than medium" },
  { id: 7, value: "LH", label: "LH", name: "Less than high" },
  { id: 8, value: "H", label: "H", name: "High" },
];

export const speakLvl: Array<OptionsProps> = [
  { id: 1, value: "OR", label: "OR", name: "Only reading" },
  { id: 2, value: "CL", label: "CL", name: "Can listen" },
  { id: 3, value: "BS", label: "BS", name: "A bit of speaking" },
  { id: 4, value: "SFS", label: "SFS", name: "Semi-free speaking" },
  { id: 5, value: "FS", label: "FS", name: "Free speaking" },
];

export interface AllOptionsProps {
	[index: string] : Array<OptionsProps>;
}
export const allOptions: AllOptionsProps = {roles, stacks, exps, speakLvl};
