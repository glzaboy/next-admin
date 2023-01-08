/** @type {import('next').NextConfig} */
const withLess = require("next-with-less");
const withTM = require("next-transpile-modules")([
  "@arco-design/web-react",
  "@arco-themes/react-arco-pro",
]);
const setting = require("./settings.json");
const nextConfig = withLess(
  withTM({
    reactStrictMode: true,
    lessLoaderOptions: {
      lessOptions: {
        modifyVars: {
          "arcoblue-6": setting.themeColor,
        },
      },
    },
  })
);

module.exports = nextConfig;
