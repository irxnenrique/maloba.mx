import { Field } from '@components/forms/field';
import { TextField } from '@components/forms/text-field';

type BilingualFieldProps = {
  title: string;
  spanishValue: string;
  englishValue: string;
  onSpanishChange: (value: string) => void;
  onEnglishChange: (value: string) => void;
  rows?: number;
};

export function BilingualField({
  title,
  spanishValue,
  englishValue,
  onSpanishChange,
  onEnglishChange,
  rows,
}: BilingualFieldProps) {
  return (
    <div className="bilingual-field-pair">
      <h3>{title}</h3>
      {rows ? (
        <>
          <TextField
            label="Español *"
            value={spanishValue}
            onChange={onSpanishChange}
            rows={rows}
          />
          <TextField label="English" value={englishValue} onChange={onEnglishChange} rows={rows} />
        </>
      ) : (
        <>
          <Field label="Español *" value={spanishValue} onChange={onSpanishChange} />
          <Field label="English" value={englishValue} onChange={onEnglishChange} />
        </>
      )}
    </div>
  );
}
