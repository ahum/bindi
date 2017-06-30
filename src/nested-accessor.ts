function setValueByArray(obj, parts, value) {

  if (!parts) {
    throw 'No parts array passed in';
  }

  if (parts.length === 0) {
    throw 'parts should never have a length of 0';
  }

  if (parts.length === 1) {
    obj[parts[0]] = value;
  } else {
    var next = parts.shift();

    if (!obj[next]) {
      obj[next] = {};
    }
    setValueByArray(obj[next], parts, value);
  }
}

function getValueByArray(obj, parts) {

  if (!parts) {
    return null;
  }

  if (parts.length === 1) {
    return obj[parts[0]];
  } else {
    var next = parts.shift();

    if (!obj[next]) {
      return null;
    }
    return getValueByArray(obj[next], parts);
  }
}

export function set(obj: any, path: string, value: any): void {
  setValueByArray(obj, path.split('.'), value);
}

export function get(obj: any, path: string): any {
  return getValueByArray(obj, path.split('.'));
}
