type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function Field({ label, value, onChange }: FieldProps) {
  return (
    <label>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
