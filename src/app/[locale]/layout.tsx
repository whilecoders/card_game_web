/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import "./globals.css";
import { ConfigProvider } from "antd";
import { COLORS } from "@/utils/colors";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
  }>
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  // Ensure that the incoming `locale` is valid
  // await children

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale ?? "");

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLORS.PRIMARY,
            colorTextHeading: COLORS.HEADING,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </NextIntlClientProvider>
  );
}
