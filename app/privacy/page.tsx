import Link from 'next/link';
import {metadata} from '@/lib/seo';

export const generateMetadata = () => ({
  ...metadata('Обработка персональных данных', 'Информация о состоянии приёма и обработки заявок.'),
  robots: {index: false, follow: false},
});

export default function Page() {
  return (
    <article className="privacy-page listing-paper" aria-labelledby="privacy-title">
      <div className="privacy-copy">
        <nav className="object-crumbs" aria-label="Хлебные крошки">
          <Link href="/">Главная</Link><span aria-hidden="true">/</span><span>Обработка данных</span>
        </nav>
        <p className="listing-kicker">Рабочая версия</p>
        <h1 id="privacy-title">Обработка персональных данных</h1>
        <section>
          <h2>Приём обращений пока не подключён</h2>
          <p>Этот сайт находится на этапе локальной подготовки. Форма не передаёт обращения в Telegram, а внешние аналитические счётчики не подключены.</p>
        </section>
        <section>
          <h2>До запуска приёма заявок</h2>
          <p>Здесь будут указаны оператор персональных данных, цели и основания обработки, перечень собираемых данных, сроки хранения, получатели и порядок обращения по вопросам обработки. Пока эти сведения не предоставлены, реальный приём обращений должен оставаться выключенным.</p>
          <p>Не отправляйте конфиденциальные документы через тестовую форму.</p>
        </section>
      </div>
    </article>
  );
}
