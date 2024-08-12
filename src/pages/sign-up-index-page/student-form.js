const formRef = document.querySelector('form');
const getInputRef = (name) => formRef.querySelector(`[name="${name}"]`);

export const StudentForm = {
  get formData() {
    return new FormData(formRef);
  },

  get data() {
    return {
      name: this.formData.get('name'),
      surname: this.formData.get('surname'),
      birthday: this.formData.get('birthday'),
    };
  },

  set data({ name, surname, birthday }) {
    getInputRef('name').value = name;
    getInputRef('surname').value = surname;
    getInputRef('birthday').value = birthday;
  },

  get age() {
    const birthDate = this.data.birthday;
    const currentDate = new Date();
    const [currentYear, currentMonth, currentDay] = [
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    ];
    const [birthYear, birthMonth, birthDay] = birthDate.split('-').map((item) => +item);
    let calculatedAge = currentYear - birthYear;

    if (currentMonth < birthMonth - 1) calculatedAge--;

    if (birthMonth - 1 === currentMonth && currentDay < birthDay) calculatedAge--;

    return calculatedAge;
  },

  onChange(action) {
    formRef.addEventListener('input', () => action(this.data));
  },

  onSubmit(action) {
    formRef.addEventListener('submit', (event) => {
      event.preventDefault();
      action();
    });
  },
};
