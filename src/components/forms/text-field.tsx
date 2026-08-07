type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
};

export function TextField({ label, value, onChange, rows = 4 }: TextFieldProps) {
  return (
    <label>
      {label}
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
