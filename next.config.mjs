// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   i18n: {
//     locales: ["en", "ru", "tr", "ar"],
//     defaultLocale: "en",
//   },
// }

// export default nextConfig

import withNextIntl from "next-intl/plugin"

export const nextConfig = withNextIntl("./i18n.ts")({
  reactStrictMode: true,
  // i18n: {
  //   locales: ["en", "ru", "tr", "ar"],
  //   defaultLocale: "en",
  // },
})

export default nextConfig
