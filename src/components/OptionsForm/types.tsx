export interface OptionFullProps {
  id: number,
  name: string,
  arr: Array<OptionProps>
}

export interface OptionProps {
  id: number,
  value: string,
  label: string,
  descr: string,
}