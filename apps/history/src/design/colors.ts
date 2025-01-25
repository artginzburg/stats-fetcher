class ColorsSingleton {
  private static instance: ColorsSingleton;
  private constructor() {}
  static getInstance() {
    if (this.instance) return this.instance;

    this.instance = new this();
    return this.instance;
  }

  readonly backgroundPage = '#161616';
  typography = {
    base: '#ddd',
  } as const;
}
export const Colors = ColorsSingleton.getInstance();
