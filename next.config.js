/** @type {import('next').NextConfig} */
const withLess = require("next-with-less");
const setting = require("./settings.json");
const withTM = require("next-transpile-modules")([
  "@arco-design/web-react",
  "@arco-themes/react-arco-pro",
]);
const { generate, getRgbStr } = require("@arco-design/color");
const newList = generate(setting.themeColor, {
  list: true,
  dark: false,
});
const nextConfig = withLess(
  withTM({
    reactStrictMode: true,
    lessLoaderOptions: {
      lessOptions: {
        modifyVars: {
          // "arcoblue-6": setting.themeColor,
          "arcoblue-1": newList[0],
          "arcoblue-2": newList[1],
          "arcoblue-3": newList[2],
          "arcoblue-4": newList[3],
          "arcoblue-5": newList[4],
          "arcoblue-6": newList[5],
          "arcoblue-7": newList[6],
          "arcoblue-8": newList[7],
          "arcoblue-9": newList[8],
          "arcoblue-10": newList[9],
        },
      },
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });

      return config;
    },
  })
);

module.exports = nextConfig;
