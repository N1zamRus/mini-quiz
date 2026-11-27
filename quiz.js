'use strict';

class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.index = 0;
    this.score = 0;
    this.answered = false;
    this.finished = false;
  }

  answer(choice) {
    if (this.finished || this.answered) return null;
    this.answered = true;
    const correct = choice === this.questions[this.index].answer;
    if (correct) this.score++;
    return correct;
  }

  next() {
    if (this.finished || !this.answered) return false;
    this.index++;
    this.finished = this.index === this.questions.length;
    this.answered = false;
    return true;
  }
}

if (typeof module !== 'undefined') module.exports = { Quiz };

if (typeof document !== 'undefined') {
  const questions = [
    { text: 'Какая планета ближе всего к Солнцу?', choices: ['Венера', 'Меркурий', 'Марс'], answer: 1 },
    { text: 'Сколько будет 7 × 8?', choices: ['54', '56', '64'], answer: 1 },
    { text: 'Какой океан самый большой?', choices: ['Тихий', 'Атлантический', 'Индийский'], answer: 0 }
  ];
  const quiz = new Quiz(questions);
  const progress = document.querySelector('#progress');
  const question = document.querySelector('#question');
  const answers = document.querySelector('#answers');
  const feedback = document.querySelector('#feedback');
  const next = document.querySelector('#next');
  const result = document.querySelector('#result');

  function render() {
    if (quiz.finished) {
      progress.hidden = true;
      question.hidden = true;
      answers.hidden = true;
      feedback.hidden = true;
      next.hidden = true;
      result.hidden = false;
      result.textContent = `Результат: ${quiz.score} из ${questions.length} правильных ответов.`;
      result.focus();
      return;
    }
    const current = questions[quiz.index];
    progress.textContent = `Вопрос ${quiz.index + 1} из ${questions.length}`;
    question.textContent = current.text;
    feedback.textContent = '';
    next.hidden = true;
    answers.replaceChildren();
    current.choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = choice;
      button.addEventListener('click', () => {
        const correct = quiz.answer(index);
        if (correct === null) return;
        feedback.textContent = correct ? 'Верно!' : `Неверно. Правильный ответ: ${current.choices[current.answer]}.`;
        for (const option of answers.querySelectorAll('button')) option.disabled = true;
        next.textContent = quiz.index === questions.length - 1 ? 'Показать результат' : 'Следующий вопрос';
        next.hidden = false;
        next.focus();
      });
      answers.append(button);
    });
  }
  next.addEventListener('click', () => {
    if (quiz.next()) {
      render();
      if (!quiz.finished) answers.querySelector('button').focus();
    }
  });
  render();
}
