export interface OptionFullProps {
  id: string,
  name: string,
  arr: Array<OptionProps>
}

export interface OptionProps {
  id: string,
  value: string,
  label: string,
  descr: string,
}