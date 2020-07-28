import { Select } from './select/index.js';

const data = [
  {id: 0, value: 'Angular'},
  {id: 1, value: 'Vue'},
  {id: 2, value: 'ReactNative'},
  {id: 3, value: 'Next'},
  {id: 4, value: 'React'},
  {id: 5, value: 'Ember'},
  {id: 6, value: 'Inferno'},
];

const collBackFunc = function (item) {
  console.log('Selected item: ', item);
};

const select = new Select('#select', {
  placeholder: 'React',
  items: data,
  cb: collBackFunc
});