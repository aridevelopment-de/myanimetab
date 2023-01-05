// @ts-nocheck

export const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return inst => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

interface File {
  lastModified: number;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
  slice: (start: number, end: number, contentType?: string) => Blob;
  stream: () => ReadableStream;
  text: () => Promise<string>;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

export const openShowFilePicker = (accept: string, multiple: boolean): Promise<File[]> => {
  const input = document.createElement('input');
  input.style = 'display: none';
  input.type = 'file';
  input.multiple = multiple;
  input.accept = accept;
  input.click();

  return new Promise(resolve => {
    input.onchange = () => {
      resolve(input.files);
    };
  });
}