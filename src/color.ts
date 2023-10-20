export default class {
  static colors: { [key: string]: string } = {
    ["Reset"]: "\x1b[0m",
    ["Bright"]: "\x1b[1m",
    ["Dim"]: "\x1b[2m",
    ["Underscore"]: "\x1b[4m",
    ["Blink"]: "\x1b[5m",
    ["Reverse"]: "\x1b[7m",
    ["Hidden"]: "\x1b[8m",

    ["FgBlack"]: "\x1b[30m",
    ["FgRed"]: "\x1b[31m",
    ["FgGreen"]: "\x1b[32m",
    ["FgYellow"]: "\x1b[33m",
    ["FgBlue"]: "\x1b[34m",
    ["FgMagenta"]: "\x1b[35m",
    ["FgCyan"]: "\x1b[36m",
    ["FgWhite"]: "\x1b[37m",
    ["FgGray"]: "\x1b[90m",

    ["BgBlack"]: "\x1b[40m",
    ["BgRed"]: "\x1b[41m",
    ["BgGreen"]: "\x1b[42m",
    ["BgYellow"]: "\x1b[43m",
    ["BgBlue"]: "\x1b[44m",
    ["BgMagenta"]: "\x1b[45m",
    ["BgCyan"]: "\x1b[46m",
    ["BgWhite"]: "\x1b[47m",
    ["BgGray"]: "\x1b[100m",
  };

  static pre_defined = {
    Info: (info: string) => {
      return [
        {
          text: "keepo",
          colors: [],
        },
        {
          text: info,
          colors: ["FgBlack", "BgCyan"],
        },
      ];
    },
    Warn: (info: string) => {
      return [
        {
          text: "keepo",
          colors: [],
        },
        {
          text: info,
          colors: ["FgBlack", "BgYellow"],
        },
      ];
    },
    Danger: (info: string) => {
      return [
        {
          text: "keepo",
          colors: [],
        },
        {
          text: info,
          colors: ["FgBlack", "BgRed"],
        },
      ];
    },
  };

  static wrap(text: string, colors: string[]) {
    let out = `${text}${this.colors.Reset}`;
    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      out = `${this.colors[color]}${out}`;
    }
    return out;
  }

  static wrap_all(blocks: { text: string; colors: string[] }[]) {
    let out = "";
    for (let i = 0; i < blocks.length; i++) {
      const { text, colors } = blocks[i];

      for (let j = 0; j < colors.length; j++) {
        out += `${this.colors[colors[j]]}`;
      }
      out += `${text}${this.colors.Reset} `;
    }
    return out;
  }

  static info(info: string, blocks: { text: string; colors: string[] }[]) {
    console.log(this.wrap_all([...this.pre_defined.Info(info), ...blocks]));
  }

  static warn(warn: string, blocks: { text: string; colors: string[] }[]) {
    console.log(this.wrap_all([...this.pre_defined.Warn(warn), ...blocks]));
  }

  static danger(danger: string, blocks: { text: string; colors: string[] }[]) {
    console.log(this.wrap_all([...this.pre_defined.Danger(danger), ...blocks]));
  }
}
