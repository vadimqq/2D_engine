import { BufferGeometry } from "./core/BufferGeometry";

export const getBindPointForSamplerType = (gl: WebGL2RenderingContext, type: number) => {
    if (type === gl.SAMPLER_2D)   return gl.TEXTURE_2D;        // eslint-disable-line
    if (type === gl.SAMPLER_CUBE) return gl.TEXTURE_CUBE_MAP;  // eslint-disable-line
    return undefined;
}

// Add your prefix here.
const browserPrefixes = [
  '',
  'MOZ_',
  'OP_',
  'WEBKIT_',
];

export const getExtensionWithKnownPrefixes = (gl: WebGL2RenderingContext, name) => {
    for (let ii = 0; ii < browserPrefixes.length; ++ii) {
      const prefixedName = browserPrefixes[ii] + name;
      const ext = gl.getExtension(prefixedName);
      if (ext) {
        return ext;
      }
    }
    return undefined;
}


export const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement, multiplier = 1) => {
  const width  = canvas.clientWidth  * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;
  if (canvas.width !== width ||  canvas.height !== height) {
    canvas.width  = width;
    canvas.height = height;
    return true;
  }
  return false;
}

export const augmentTypedArray = (typedArray, numComponents) => {
    let cursor = 0;
    typedArray.push = function() {
      for (let ii = 0; ii < arguments.length; ++ii) {
        const value = arguments[ii];
        if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
          for (let jj = 0; jj < value.length; ++jj) {
            typedArray[cursor++] = value[jj];
          }
        } else {
          typedArray[cursor++] = value;
        }
      }
    };
    typedArray.reset = function(opt_index) {
      cursor = opt_index || 0;
    };
    typedArray.numComponents = numComponents;
    Object.defineProperty(typedArray, 'numElements', {
      get: function() {
        return this.length / this.numComponents | 0;
      },
    });
    return typedArray;
  }

export const createAugmentedTypedArray = (numComponents, numElements, opt_type) => {
  const Type = opt_type || Float32Array;
  return augmentTypedArray(new Type(numComponents * numElements), numComponents);
}

export const allButIndices = (name) => {
    return name !== 'indices';
}

export const createMapping = (obj: BufferGeometry) => {
    const mapping: {[key: string]: string} = {};
    Object.keys(obj).filter(allButIndices).forEach(function(key) {
      mapping['a_' + key] = key;
    });
    return mapping;
}

export const getGLTypeForTypedArray = (gl: WebGL2RenderingContext, typedArray) => {
    if (typedArray instanceof Int8Array)    { return gl.BYTE; }            // eslint-disable-line
    if (typedArray instanceof Uint8Array)   { return gl.UNSIGNED_BYTE; }   // eslint-disable-line
    if (typedArray instanceof Int16Array)   { return gl.SHORT; }           // eslint-disable-line
    if (typedArray instanceof Uint16Array)  { return gl.UNSIGNED_SHORT; }  // eslint-disable-line
    if (typedArray instanceof Int32Array)   { return gl.INT; }             // eslint-disable-line
    if (typedArray instanceof Uint32Array)  { return gl.UNSIGNED_INT; }    // eslint-disable-line
    if (typedArray instanceof Float32Array) { return gl.FLOAT; }           // eslint-disable-line
    throw 'unsupported typed array type';
}

  // This is really just a guess. Though I can't really imagine using
  // anything else? Maybe for some compression?
export const getNormalizationForTypedArray = (typedArray) => {
    if (typedArray instanceof Int8Array)    { return true; }  // eslint-disable-line
    if (typedArray instanceof Uint8Array)   { return true; }  // eslint-disable-line
    return false;
}

export const isArrayBuffer = (a) => {
  return a.buffer && a.buffer instanceof ArrayBuffer;
}

export const guessNumComponentsFromName = (name, length) => {
    let numComponents;
    if (name.indexOf('coord') >= 0) {
      numComponents = 2;
    } else if (name.indexOf('color') >= 0) {
      numComponents = 4;
    } else {
      numComponents = 3;  // position, normals, indices ...
    }

    if (length % numComponents > 0) {
      throw 'can not guess numComponents. You should specify it.';
    }

    return numComponents;
}

export const makeTypedArray = (array, name): Uint16Array => {
    if (isArrayBuffer(array)) {
      return array;
    }

    if (array.data && isArrayBuffer(array.data)) {
      return array.data;
    }

    if (Array.isArray(array)) {
      array = {
        data: array,
      };
    }

    if (!array.numComponents) {
      array.numComponents = guessNumComponentsFromName(name, array.length);
    }

    let type = array.type;
    if (!type) {
      if (name === 'indices') {
        type = Uint16Array;
      }
    }
    const typedArray = createAugmentedTypedArray(array.numComponents, array.data.length / array.numComponents | 0, type);
    typedArray.push(array.data);
    return typedArray;
}

export const createAttribsFromArrays = (gl: WebGL2RenderingContext, arrays: BufferGeometry) => {
    const mapping = createMapping(arrays);
    const attribs = {};
    Object.keys(mapping).forEach(function(attribName) {
      const bufferName = mapping[attribName];
      const origArray = arrays[bufferName];
      if (origArray.value) {
        attribs[attribName] = {
          value: origArray.value,
        };
      } else {
        const array = makeTypedArray(origArray, bufferName);
        attribs[attribName] = {
          buffer:        createBufferFromTypedArray(gl, array),
          numComponents: origArray.numComponents || array.numComponents || guessNumComponentsFromName(bufferName),
          type:          getGLTypeForTypedArray(gl, array),
          normalize:     getNormalizationForTypedArray(array),
        };
      }
    });
    return attribs;
}

export const getArray = (array) => {
  return array.length ? array : array.data;
}

export const getNumComponents = (array, arrayName) => {
  return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length);
}


const positionKeys = ['position', 'positions', 'a_position'];
export const getNumElementsFromNonIndexedArrays = (arrays) => {
    let key;
    for (const k of positionKeys) {
      if (k in arrays) {
        key = k;
        break;
      }
    }
    key = key || Object.keys(arrays)[0];
    const array = arrays[key];
    const length = getArray(array).length;
    const numComponents = getNumComponents(array, key);
    const numElements = length / numComponents;
    if (length % numComponents > 0) {
      throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
    }
    return numElements;
}


export const createBufferFromTypedArray = (
  gl: WebGL2RenderingContext,
  array: BufferSource,
  type: number = gl.ARRAY_BUFFER,
  drawType = gl.STATIC_DRAW
  ) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, array, drawType);
  return buffer;
}

export const createBufferInfoFromArrays = (gl: WebGL2RenderingContext, arrays: BufferGeometry, opt_mapping?: any) => {
    const indices = makeTypedArray(arrays.indices, 'indices');

    const bufferInfo = {
      attribs: createAttribsFromArrays(gl, arrays, opt_mapping),
      indices: createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER),
      numElements: indices.length,
    };
    // if (arrays.indices) {
    //   const indices = makeTypedArray(arrays.indices, 'indices');
    //   bufferInfo.indices = createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
    //   bufferInfo.numElements = indices.length;
    // } else {
    //   bufferInfo.numElements = getNumElementsFromNonIndexedArrays(arrays);
    // }

    return bufferInfo;
}

export const createBuffersFromArrays = (gl: WebGL2RenderingContext, arrays) => {
    const buffers = { };
    Object.keys(arrays).forEach(function(key) {
      const type = key === 'indices' ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
      const array = makeTypedArray(arrays[key], name);
      buffers[key] = createBufferFromTypedArray(gl, array, type);
    });

    // hrm
    if (arrays.indices) {
      buffers.numElements = arrays.indices.length;
    } else if (arrays.position) {
      buffers.numElements = arrays.position.length / 3;
    }

    return buffers;
}

export const drawBufferInfo = (gl, bufferInfo, primitiveType, count, offset) => {
    const indices = bufferInfo.indices;
    primitiveType = primitiveType === undefined ? gl.TRIANGLES : primitiveType;
    const numElements = count === undefined ? bufferInfo.numElements : count;
    offset = offset === undefined ? 0 : offset;
    if (indices) {
      gl.drawElements(primitiveType, numElements, gl.UNSIGNED_SHORT, offset);
    } else {
      gl.drawArrays(primitiveType, offset, numElements);
    }
}

export const glEnumToString = (gl, v) => {
    const results = [];
    for (const key in gl) {
      if (gl[key] === v) {
        results.push(key);
      }
    }
    return results.length
        ? results.join(' | ')
        : `0x${v.toString(16)}`;
}