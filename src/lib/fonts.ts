import { Nunito_Sans, Pacifico } from "next/font/google";

export const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
});

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});