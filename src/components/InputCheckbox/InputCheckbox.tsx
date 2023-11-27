interface InputCheckBoxProps {
  classname: string;
  checked: boolean;
  handleChange: any,
  label?: string;
}

export default function InputCheckBox({
  classname,
  checked,
  handleChange,
  label,
}: InputCheckBoxProps): JSX.Element {
  return (
    <label className={classname}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="switch__input"
      />
      <span className="switch__label">{label}</span>
      <span className="switch__thumb"></span>
      <span className="switch__value"></span>
    </label>
  );
}
