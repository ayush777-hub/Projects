import { Position, Tile } from "../../chess.model";

// export class CommonHelper {
//   static deepClone(obj: any): object {
//     // Handle null, undefined, or primitive types
//     if (obj === null || typeof obj !== "object") {
//       return obj;
//     }

//     // Handle Date
//     if (obj instanceof Date) {
//       return new Date(obj.getTime());
//     }

//     // Handle Array
//     if (Array.isArray(obj)) {
//       const arrCopy = [];
//       for (let i = 0; i < obj.length; i++) {
//         arrCopy[i] = this.deepClone(obj[i]);
//       }
//       return arrCopy;
//     }

//     // Handle Object and Class instances
//     const objCopy = Object.create(Object.getPrototypeOf(obj));
//     for (const key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         objCopy[key] = this.deepClone(obj[key]);
//       }
//     }
//     return objCopy;
//   }
// }
// Deep clone utility that handles:
// 1. Primitive types
// 2. Date objects
// 3. Arrays
// 4. Plain objects
// 5. Class instances
// 6. Methods
// 7. Circular references
// 8. Symbol properties
// 9. Getter/Setter properties

/**
 * A utility class for deep cloning objects and their properties
 */
/**
 * A utility class for deep cloning objects and their properties
 */
class DeepCloner {
  private references = new WeakMap<any, any>();

  /**
   * Checks if a value is a plain object (not a class instance)
   */
  private isPlainObject(value: any): boolean {
    if (!value || typeof value !== "object") return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  /**
   * Main clone method that handles different types of values
   */
  public clone<T>(value: T): T {
    // Handle null, undefined and primitive types
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value !== "object" && typeof value !== "function") {
      return value;
    }

    // Check for circular references
    if (this.references.has(value)) {
      return this.references.get(value);
    }

    // Handle special types
    if (value instanceof Date) {
      return new Date(value.getTime()) as unknown as T;
    }

    if (value instanceof RegExp) {
      return new RegExp(value.source, value.flags) as unknown as T;
    }

    if (value instanceof Map) {
      const clonedMap = new Map();
      this.references.set(value, clonedMap);
      value.forEach((val, key) => {
        clonedMap.set(this.clone(key), this.clone(val));
      });
      return clonedMap as unknown as T;
    }

    if (value instanceof Set) {
      const clonedSet = new Set();
      this.references.set(value, clonedSet);
      value.forEach((val) => {
        clonedSet.add(this.clone(val));
      });
      return clonedSet as unknown as T;
    }

    // Handle Arrays
    if (Array.isArray(value)) {
      const clonedArray: any[] = [];
      this.references.set(value, clonedArray);
      value.forEach((item, index) => {
        clonedArray[index] = this.clone(item);
      });
      return clonedArray as unknown as T;
    }

    // Handle Functions (return as is)
    if (typeof value === "function") {
      return value;
    }

    // Handle Objects (including class instances)
    const constructor = Object.getPrototypeOf(value).constructor as new () => T;
    let clonedObj: T;

    if (this.isPlainObject(value)) {
      clonedObj = {} as T;
    } else {
      try {
        clonedObj = new constructor();
      } catch {
        clonedObj = {} as T;
      }
    }

    // Store reference to handle circular dependencies
    this.references.set(value, clonedObj);

    // Clone all properties (including non-enumerable ones and symbols)
    [
      ...Object.getOwnPropertyNames(value),
      ...Object.getOwnPropertySymbols(value),
    ].forEach((prop) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, prop);
      if (!descriptor) return;

      if (descriptor.get || descriptor.set) {
        // Handle getter/setter
        Object.defineProperty(clonedObj, prop, {
          get: descriptor.get,
          set: descriptor.set,
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
        });
      } else {
        // Handle regular properties
        Object.defineProperty(clonedObj, prop, {
          value: this.clone(descriptor.value),
          writable: descriptor.writable,
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
        });
      }
    });

    return clonedObj;
  }
}

/**
 * Helper function for easier usage of DeepCloner
 */
export function deepClone<T>(obj: T): T {
  return new DeepCloner().clone(obj);
}

export const CanAttack = {
  Horizontally: ["King", "Queen", "Rook"],
  Vertically: ["King", "Queen", "Rook"],
  Diagonally: ["King", "Queen", "Bishop", "Pawn"],
  HorseMove: ["Horse"],
};
