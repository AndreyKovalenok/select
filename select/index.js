export class Select {
  /**
   * Консутруктор класса Select
   * @param {String} selector - селектор тега на страница, в который будет вставлен селект 
   * @param {String} placeholder? - необязательный параметр. Дефолтное состояние селекта. В случае
   * наличия объекта со схожим значение во входных данных, узел соответствующего элемента селекта
   * будет выбран как выбранный
   * @param {Array} items - массив входных данных для пунктов селекта
   * @param {Function} cb - функция колбек, вызываемая каждый раз при установке нового значения селекта
   */
  constructor(selector, { placeholder, items, cb }) {
    this.selectNode = document.querySelector(selector);
    this.placeholder = placeholder;
    this.items = items;
    this.cb = cb;
    
    this.render();
  }

  /**
   * Метод, возвращающий шаблон с разметкой селекта, получаемой на основе передаваемых в него параметров
   * @param {Array} items - массив исходных данных для формирования пунктов селекта
   * @param {String} placeholder - дефолтное состояние селекта
   */
  getTemplate = (items = [], placeholder = 'Выберите элемент') => `
  <div class="select__input" data-type="select">
    <span data-type="placeholder">${ placeholder }</span>
    <img class="select__img" src="select/down-arrow.svg" alt="" width="15" height="15" data-type="image"> 
  </div>
  <div class="select__dropdown" data-type="dropdown">
    <ul class="select__list">
      ${
        items.map(({ id, value }) => `
          <li class="select__item" data-type="item" data-id=${ id }>${ value }</li>
        `).join('')
      }
    </ul>
  </div>
`;

  /**
   * Обработчик события клика по селекту
   */
  clickHandler = (evt) => {
    const { type, id } = evt.target.dataset;

    switch (type) {
      case 'select':
        this.toggle();
        break;
      case 'item':
        this.selectItem(Number(id), evt.target);
        break;
    }
  }

  /**
   * Обработчик события клика за пределы селекта
   */
  outsideClickHandler = (evt) => {
    if (evt.target.contains(this.selectNode)) {
      this.close();
    }
  }

  /**
   * Метод открытия/закрытия селекта
   */
  toggle() {
    if (this.selectInput.classList.contains('select__input--active')) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Метод рендера селекта и определения исходных переменных, необходимых для работы селекта 
   */
  render() {
    this.selectNode.classList.add('select');
    this.selectNode.addEventListener('click', this.clickHandler);
    this.selectNode.innerHTML = this.getTemplate(this.items, this.placeholder);

    this.selectInput = this.selectNode.querySelector('[data-type="select"]');
    this.selectImg = this.selectInput.querySelector('[data-type="image"]');
    this.selectPlaceholder = this.selectInput.querySelector('[data-type="placeholder"]');
    this.selectItems = this.selectNode.querySelectorAll('[data-type="item"]');
    this.selectDropDown = this.selectNode.querySelector('[data-type="dropdown"]');

    // Определение состояния селекта в случае наличия во входных параметрах дефолтного состояния селекта
    if (this.placeholder) {
      const defaultItem = this.items.find(({ value }) => value === this.placeholder);

      defaultItem && Array.from(this.selectItems)
        .find(({ dataset: { id } }) => Number(id) === defaultItem.id)
        .classList.add('select__item--selected');
      
    }
  }

  open() {
    this.selectInput.classList.add('select__input--active');
    this.selectImg.classList.add('select__img--reverse');

    // Функция планирования перерисовки
    const raf = function (fn) {
      requestAnimationFrame(function () {
          fn();
      });
    };

    // Обработчик события trainsitionend, срабатывающий при открытии списка пунктов
    const openTransitionendHandler = () => {
      this.selectDropDown.classList.add('select__dropdown--entered');
      this.selectDropDown.classList.remove('select__dropdown--enter');
      this.selectDropDown.classList.remove('select__dropdown--entering');

      this.selectDropDown.removeEventListener('transitionend', openTransitionendHandler);
    }
    
    this.selectDropDown.classList.add('select__dropdown--enter');
    raf(() => {
      this.selectDropDown.classList.add('select__dropdown--entering');
    });
    this.selectDropDown.addEventListener('transitionend', openTransitionendHandler);

    document.addEventListener('click', this.outsideClickHandler);
  }

  close() {
    this.selectImg.classList.remove('select__img--reverse');
    this.selectDropDown.classList.add('select__dropdown--exit');

    // Обработчик события trainsitionend, срабатывающий при закрытии списка пунктов
    const closeTransitionendHandler = () => {
      this.selectDropDown.classList.remove('select__dropdown--entered');
      this.selectDropDown.classList.remove('select__dropdown--exit');
      this.selectInput.classList.remove('select__input--active');

      this.selectDropDown.removeEventListener('transitionend', closeTransitionendHandler);
    }

    this.selectDropDown.addEventListener('transitionend', closeTransitionendHandler);
    
    document.removeEventListener('click', this.outsideClickHandler);
  }

  /**
   * Метод выбора пункта 
   * @param {Number} id - индекс пункта, по которому был произведен клик
   * @param {Object} target - пункт, по которому был произведен клик
   */
  selectItem(id, target) {
    if (!target.classList.contains('select__item--selected')) {
      // Установка нового состояния селекта
      const item = this.items[id];
      this.selectPlaceholder.textContent = item.value;

      // Выеделения выбранного пункта
      this.selectItems.forEach(el => {
        if (el.classList.contains('select__item--selected')) {
          el.classList.remove('select__item--selected');
        }
      });
      target.classList.add('select__item--selected');
      
      this.close();
      this.cb(item);
    }
  }
};