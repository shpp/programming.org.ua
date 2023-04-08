const inRange = (x, from, to) => x >= from && x <= to;

module.exports = (lang = 'en', creationDate, pattern) => {
  const tokens = {
    years1: { ru: 'лет', ua: 'років', en: 'years' },
    years2: { ru: 'год', ua: 'рік', en: 'year' },
    years3: { ru: 'года', ua: 'роки', en: 'years' },
  };

  const [day, month, year] = creationDate.split('-');
  const schoolFoundationDate = new Date(year, month - 1, day);
  const ageDifMs = Date.now() - schoolFoundationDate;
  const ageDate = new Date(ageDifMs);
  const yearsNum = Math.abs(ageDate.getUTCFullYear() - 1970);

  const yearsStr = inRange(yearsNum, 5, 20)
    ? tokens.years1[lang]
    : yearsNum % 10 === 1
    ? tokens.years2[lang]
    : inRange(yearsNum % 10, 2, 4)
    ? tokens.years3[lang]
    : tokens.years1[lang];

  return (pattern || '').replace('{{yearsNum}}', yearsNum).replace('{{yearsStr}}', yearsStr);
};
