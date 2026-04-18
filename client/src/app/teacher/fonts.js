import { Fraunces, Source_Sans_3 } from "next/font/google";

export const teacherSans = Source_Sans_3({
  subsets: ["latin", "vietnamese"],
  variable: "--font-teacher-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const teacherDisplay = Fraunces({
  subsets: ["latin", "vietnamese"],
  variable: "--font-teacher-display",
  display: "swap",
  weight: ["600", "700"],
});
