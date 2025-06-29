export function batchUpdateFormData<T>(
  updates: Partial<T>,
  formData: T,
  setFormData: (data: T) => void,
) {
  setFormData({
    ...formData,
    ...updates,
  });
}
