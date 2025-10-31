import { useEffect, useRef, useState } from 'react';

type FileInputChildrenProps = {
  // props: Record<string, any>;
  // input: React.ReactNode;
  file: File | null;
  files: File[];
  reset: () => void;
  pickFiles: () => void;
}

type FileInputProps = {
  name?: string;
  children: (props: FileInputChildrenProps) => JSX.Element;
} & (
  {
    multiple: true;
    files?: File[];
    onChange?: (files: File[]) => void;
    file?: undefined;
  }
  | {
    multiple?: false;
    files?: undefined;
    file?: File;
    onChange?: (file: File) => void;
  }
)

export default function FileInput({
  name,
  children,
  multiple,
  file: _file,
  files: _files = [],
  onChange,
}: FileInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const [files, setFiles] = useState<File[]>(multiple ? _files : _file ? [_file] : []);

  const reset = () => {
    setFiles([]);
  };

  useEffect(() => {
    if (ref.current) {
      if (multiple && _files) {
        const dataTransfer = new DataTransfer();
        _files.forEach((file) => dataTransfer.items.add(file));
        ref.current.files = dataTransfer.files;
        setFiles(_files);
      } else if (!multiple && _file) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(_file);
        ref.current.files = dataTransfer.files;
        setFiles([_file]);
      }
    }
  }, [_files, _file, multiple]);

  return (
    <div>
      <label ref={labelRef}>
        <input
          ref={ref}
          name={name}
          type="file"
          hidden
          multiple={multiple}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFiles(Array.from(e.target.files));

              if (multiple) {
                onChange?.(Array.from(e.target.files) as File[] & File);
              } else {
                onChange?.(e.target.files?.[0] as File[] & File);
              }
            }
          }}
        />
      </label>

      {children({
        pickFiles: () => {
          labelRef.current?.click();
        },
        file: files[0] || null,
        files,
        reset,
      })}
    </div>
  );

  return children({
    // props: {
    //   component: 'label',
    // },
    pickFiles: () => {
      labelRef.current?.click();
    },
    file: files[0] || null,
    files,
    reset,
    // input: (
    //   <input
    //     ref={ref}
    //     name={name}
    //     type="file"
    //     hidden
    //     multiple={multiple}
    //     onChange={(e) => {
    //       if (e.target.files?.[0]) {
    //         setFiles(Array.from(e.target.files));

    //         if (multiple) {
    //           onChange?.(Array.from(e.target.files) as File[] & File);
    //         } else {
    //           onChange?.(e.target.files?.[0] as File[] & File);
    //         }
    //       }
    //     }}
    //   />
    // ),
  });
}
