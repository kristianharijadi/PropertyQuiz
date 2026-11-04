import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The 60-Second Property Match | Sinar Mas Land',
  description: 'Discover a property that matches your lifestyle. A touchscreen experience concept for Sinar Mas Land.'
};
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) {
  return <html lang="id"><body>{children}</body></html>;
}
