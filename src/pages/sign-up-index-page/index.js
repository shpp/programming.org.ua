import './index.scss';
import { StudentStorage } from './student-storage';
import { StudentForm } from './student-form';
import { PageProxy } from './page-proxy';

const minAdultsAge = 17;
const minTeensAge = 12;

StudentForm.data = StudentStorage.data;
StudentForm.onChange((data) => (StudentStorage.data = data));
StudentForm.onSubmit(() => {
  if (StudentForm.age >= minAdultsAge) return PageProxy.redirectToAdults();
  if (StudentForm.age >= minTeensAge) return PageProxy.redirectToTeens();

  PageProxy.showWarning();
});
