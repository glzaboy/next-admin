declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.less" {
  const classes: { [className: string]: string };
  export default classes;
}

declare module "*/settings.json" {
  const value: {
    colorWeek: boolean;
    navbar: boolean;
    menu: boolean;
    footer: boolean;
    themeColor: string;
    menuWidth: number;
  };

  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "@arco-design/color" {
  export const generate = (
    color: string,
    options?: {
      index?: number;
      dark?: boolean;
      list?: boolean;
      format?: string;
    }
  ) => any;
  export const getRgbStr = (color: string) => string;
}
