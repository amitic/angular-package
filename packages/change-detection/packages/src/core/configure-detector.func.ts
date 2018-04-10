// external
import { merge } from 'lodash-es';

// @angular-package
import { StoreOriginalClass } from '@angular-package/core/store';

// internal
import { ApChangeDetectionProperties, ApChangeDetectionOptions } from '../../interface';
import { ApChangeDetectorClass } from '../../change-detector/src/change-detector.class';
import { DEFAULT_OPTIONS } from '../default_options';

/**
 * @export
 * @template T
 * @param {Function} component
 * @param {ApChangeDetectionOptions} options
 * @returns {void}
 */
export function configureDetector<T>(
  component: Function,
  properties: ApChangeDetectionProperties,
  options?: ApChangeDetectionOptions
): void {

  if (options) {
    options = merge(DEFAULT_OPTIONS, options);
  } else {
    options = DEFAULT_OPTIONS;
  }

  // Add to component - must be.
  Object.defineProperties(component.prototype, {

    _changeDetector: {
      configurable: false,
      writable: true
    },
    changeDetector: {
      set: function (value: ApChangeDetectorClass<T>) {
        this._changeDetector = value;
      },
      get: function (): ApChangeDetectorClass<T> {
        if (this._changeDetector === undefined) {
          this._changeDetector = new ApChangeDetectorClass<T>(this);
          Object.assign(this._changeDetector, {
            properties: Object.assign({}, properties)
          });
        }
        return this._changeDetector as ApChangeDetectorClass<T>;
      }
    },

    detection: {
      set(detection: boolean) {
        this.changeDetector.detection = detection;
        this.changeDetector.setDetection(this);
      },
      get(): boolean {
        return this.changeDetector.detection;
      }
    },

  });

  if (options) {
    // Detach.
    if (options.detach) {
      Object.defineProperties(component.prototype, {
        [`${options.detach}`]: {
          configurable: false,
          writable: false,
          value: function (): void {
            this.changeDetector.detach(this);
          }
        }
      });
    }

    // Detect.
    if (options.detect) {
      Object.defineProperties(component.prototype, {
        [`${options.detect}`]: {
          configurable: false,
          writable: false,
          value: function (property?: string): void {
            this.changeDetector.detect(this, property);
          }
        }
      });
    }

    // Properties.
    if (options.properties) {
      Object.defineProperties(component.prototype, {
        [`${options.properties}`]: {
          set: function (value: ApChangeDetectionProperties) {
            this.changeDetector.detect(this);
            Object.assign(this.changeDetector, {
              properties: value
            });
            this.changeDetector.setDetection(this);
          },
          get: function (): ApChangeDetectionProperties {
            return this.changeDetector.properties;
          }
        }
      });
    }

    // Reattach.
    if (options.reattach) {
      Object.defineProperties(component.prototype, {
        [`${options.reattach}`]: {
          configurable: false,
          writable: false,
          value: function (): void {
            this.changeDetector.reattach(this);
          }
        }
      });
    }

  }
}
