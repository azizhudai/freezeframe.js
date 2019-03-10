import {
  compose,
  asyncCallback,
  normalizeElements,
  validateElements,
  imagesLoaded
} from './utils';

import {
  wrap,
  htmlToNode
} from './utils/dom';

class Freezeframe {
  constructor(
    selectorOrNodes = '.freezeframe',
    options = {
      responsive: true
    }
  ) {
    this.items = [];
    this.options = options;
    this.init(selectorOrNodes);
  }

  init(selectorOrNodes) {
    this.capture(selectorOrNodes);
    this.load(this.$images);
  }

  capture(selectorOrNodes) {
    this.$images = compose(
      normalizeElements,
      validateElements
    )(selectorOrNodes);
  }

  load($images) {
    $images.forEach(async ($image) => {
      const { elements } = await asyncCallback(imagesLoaded, $image);
      this.setup(elements[0]);
    });
  }

  setup($image) {
    const freeze = this.wrap($image);
    this.items.push(freeze);
    this.process(freeze);
    // $image.classList.add('ff-setup');
  }

  wrap($image) {
    const $container = htmlToNode(`
      <div class="ff-container ff-loading-icon">
      </div>
    `);
    const $canvas = htmlToNode(`
      <canvas class="ff-canvas" width="0" height="0">
      </canvas>
    `);

    if (this.options.response) {
      $container.classList.add('ff-responsive');
    }
    $container.appendChild($canvas);
    wrap($image, $container);

    return {
      $container,
      $canvas,
      $image
    };
  }

  process(freeze) {
    const { $canvas, $image } = freeze;
    const { clientWidth, clientHeight } = $image;
    $canvas.setAttribute('width', clientWidth);
    $canvas.setAttribute('height', clientHeight);
    const context = $canvas.getContext('2d');
    context.drawImage($image, 0, 0, clientWidth, clientHeight);
    return freeze;
    // const transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';
  }
}

window.Freezeframe = Freezeframe;

export default Freezeframe;
