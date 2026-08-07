import type { ReactNode } from 'react';

type FormSectionProps = {
  title: string;
  children: ReactNode;
  order?: number;
};

export function FormSection({ title, children, order }: FormSectionProps) {
  return (
    <div className="editor-section" style={order ? { order } : undefined}>
      <span>{title}</span>
      {children}
    </div>
  );
}
