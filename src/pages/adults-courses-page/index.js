import './index.scss';
import Accordion from '../../template-partials/accordion';

function main() {
  new Accordion('.faq ul', { openItems: 'all' });
}

main();
