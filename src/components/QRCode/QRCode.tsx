import qrcode from 'qrcode';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

type QRCodeProps = React.HTMLAttributes<HTMLDivElement> & {
  text: string;
  size?: number;
};

export default function QRCodes({ text, size = 100, ...props }: QRCodeProps) {
  const [qrDataURL, setQrDataURL] = useState<string | null>(null);

  const generateQRCode = async () => {
    const qrDataURL = await qrcode.toDataURL(text, { width: size * 2, margin: 0 });
    setQrDataURL(qrDataURL);
  };

  useEffect(() => {
    generateQRCode();
  }, [text]);

  if (!qrDataURL) return null;
  return (
    <Image src={qrDataURL} alt="QR Code" width={size} height={size} className={twMerge(props.className)} />
  );
}
