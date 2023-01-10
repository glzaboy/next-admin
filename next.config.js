/** @type {import('next').NextConfig} */
const withLess = require("next-with-less");
const setting = require("./settings.json");
const nextConfig = withLess({
  reactStrictMode: true,
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        "arcoblue-6": setting.themeColor,
      },
    },
  },
});

module.exports = nextConfig;
