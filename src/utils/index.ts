export const getType = (o: any) => Object.prototype.toString.call(o);

export const isArray = (data: any) => getType(data) === '[object Array]';

export const isObject = (data: any) => getType(data) === '[object Object]';
