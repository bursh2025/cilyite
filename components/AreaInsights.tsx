import Inquiry from './Inquiry';

const questions = [
  ['Как дойти до здания?', 'Пройдите от метро или Комаровского рынка тем путём, которым придут ваши клиенты.'],
  ['Виден ли вход с улицы?', 'Подойдите со стороны основного маршрута и посмотрите, где впервые замечаете дверь или вывеску.'],
  ['Как попасть на нужный этаж?', 'Пройдите от входа до помещения. Проверьте указатели, лестницы и доступность лифта.'],
];

export default function AreaInsights() {
  return (
    <section className="listing-paper viewing-checklist" id="district-future" aria-labelledby="viewing-checklist-title">
      <h2 id="viewing-checklist-title">Что проверить на просмотре</h2>
      <ul>
        {questions.map(([question, tip]) => (
          <li key={question}><h3>{question}</h3><p>{tip}</p></li>
        ))}
      </ul>
      <Inquiry purpose="viewing" label="Записаться на просмотр" className="listing-primary" />
    </section>
  );
}
