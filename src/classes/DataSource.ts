export class DataSource<Name extends string = string> {
  constructor(
    readonly name: Name,
    readonly description: string,
    readonly getData: () => Promise<number>,
  ) {}
}
