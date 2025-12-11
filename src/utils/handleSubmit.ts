import { BaseSyntheticEvent, FormEvent } from 'react';

export default function handleSubmit<T extends Record<string, any>>(handler: (data: T) => Promise<void> | void): (event: FormEvent<HTMLFormElement>) => Promise<void> {
  return async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const e = event as BaseSyntheticEvent;

    const data = Object.fromEntries((new FormData(event.currentTarget) as any).entries()) as Record<string, any>;

    const resultData: Record<string, any> = {};

    for (const key in data) {
      const keyParts = key.split(':');

      if (keyParts.length === 2) {
        const [_key, type] = keyParts;

        if (type === 'json') {
          resultData[_key] = JSON.parse(data[key]);
        } else {
          resultData[_key] = data[key];
        }
      } else {
        resultData[key] = data[key];
      }
    }

    for (const [name, file, element] of Object.values(e.target.elements).map((e: any) => [e.name, e.files, e])) {
      if (file) {
        if (file instanceof FileList) {
          resultData[name] = Array.from(file);
        } else {
          resultData[name] = file;
        }
      }

      if (element.type === 'number') {
        resultData[name] = Number(element.value);
      }
    }

    await handler(resultData as T);
  };
}
