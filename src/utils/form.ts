// src/utils/form.ts
export function createSyntheticChangeBatch(
  fields: Record<string, string>,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
) {
  Object.entries(fields).forEach(([name, value]) => {
    const syntheticEvent = {
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  });
}
