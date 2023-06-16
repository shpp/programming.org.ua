import './index.scss';
import '../../template-partials/question-form/question-form';
import Accordion from '../../template-partials/accordion';

function main() {
  new Accordion('.faq ul', { openItems: 'all' });
}

main();
