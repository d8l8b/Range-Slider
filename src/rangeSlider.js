class RangeSlider {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) {
            console.error(`RangeSlider: No element found with the selector "${selector}".`);
            return;
        }
        this._setupOptions(options);
        this._createDOM();
        this._setupEventListeners();
        this.update();
    }

    _setupOptions(options) {
        const defaults = {
            min: 0,
            max: 100,
            step: 1,
            values: [25, 75],
            onChange: null
        };
        this.options = { ...defaults, ...options };
    }

    _createDOM() {
        this.container.innerHTML = `
            <div class="rs-container">
                <div class="rs-tooltip rs-tooltip-min"></div>
                <div class="rs-tooltip rs-tooltip-max"></div>
                <div class="rs-track">
                    <div class="rs-range"></div>
                </div>
                <input type="range" class="rs-input rs-input-min" aria-label="Minimum Value">
                <input type="range" class="rs-input rs-input-max" aria-label="Maksimum Value">
            </div>
        `;
        this.minSlider = this.container.querySelector('.rs-input-min');
        this.maxSlider = this.container.querySelector('.rs-input-max');
        this.rangeDiv = this.container.querySelector('.rs-range');
        this.minTooltip = this.container.querySelector('.rs-tooltip-min');
        this.maxTooltip = this.container.querySelector('.rs-tooltip-max');

        [this.minSlider, this.maxSlider].forEach(slider => {
            slider.min = this.options.min;
            slider.max = this.options.max;
            slider.step = this.options.step;
        });

        this.minSlider.value = this.options.values[0];
        this.maxSlider.value = this.options.values[1];
    }

    _setupEventListeners() {
        this.minSlider.addEventListener('input', () => this.update());
        this.maxSlider.addEventListener('input', () => this.update());
        this.minSlider.addEventListener('change', () => this._triggerOnChange());
        this.maxSlider.addEventListener('change', () => this._triggerOnChange());

        [this.minSlider, this.maxSlider].forEach(slider => {
            const tooltip = slider.classList.contains('rs-input-min') ? this.minTooltip : this.maxTooltip;
            slider.addEventListener('pointerdown', () => tooltip.classList.add('rs-tooltip--visible'));
            slider.addEventListener('pointerup', () => tooltip.classList.remove('rs-tooltip--visible'));
            slider.addEventListener('pointerleave', () => tooltip.classList.remove('rs-tooltip--visible'));
        });
    }

    update() {
        let val1 = parseFloat(this.minSlider.value);
        let val2 = parseFloat(this.maxSlider.value);
        this.low = Math.min(val1, val2);
        this.high = Math.max(val1, val2);

        const range = this.options.max - this.options.min;
        const lowPercent = ((this.low - this.options.min) / range) * 100;
        const highPercent = ((this.high - this.options.min) / range) * 100;
        this.rangeDiv.style.left = lowPercent + '%';
        this.rangeDiv.style.width = (highPercent - lowPercent) + '%';

        const minSliderPercent = ((val1 - this.options.min) / range) * 100;
        const maxSliderPercent = ((val2 - this.options.min) / range) * 100;
        this.minTooltip.textContent = val1;
        this.minTooltip.style.left = `calc(${minSliderPercent}% + (${12 - minSliderPercent * 0.24}px))`;
        this.maxTooltip.textContent = val2;
        this.maxTooltip.style.left = `calc(${maxSliderPercent}% + (${12 - maxSliderPercent * 0.24}px))`;
    }

    _triggerOnChange() {
        if (typeof this.options.onChange === 'function') {
            this.options.onChange(this.low, this.high);
        }
    }
    
    onChange(callback) {
        if (typeof callback === 'function') {
            this.options.onChange = callback;
        }
    }
}