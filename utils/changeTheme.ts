const { generate, getRgbStr } = require("@arco-design/color");

function changeTheme(theme: string, themeColor: string) {
  if (theme === "dark") {
    document.body.setAttribute("arco-theme", "dark");
  } else {
    document.body.removeAttribute("arco-theme");
  }
  const newList = generate(themeColor, {
    list: true,
    dark: theme === "dark",
  });
  newList.forEach((l: string, index: number) => {
    const rgbStr = getRgbStr(l);
    document.body.style.setProperty(`--arcoblue-${index + 1}`, rgbStr);
  });
}

export default changeTheme;
