const key = 'anketa.student';
const storage = localStorage;
const initialData = { name: '', surname: '', birthday: '' };

export const StudentStorage = {
  get data() {
    const savedData = storage.getItem(key);

    return JSON.parse(savedData) ?? initialData;
  },

  set data(data) {
    const serializedData = JSON.stringify(data);

    storage.setItem(key, serializedData);
  },

  reset() {
    this.data = initialData;
  },
};
