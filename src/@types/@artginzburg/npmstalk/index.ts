declare module '@artginzburg/npmstalk' {
  const getMaintainerDownloads: (
    username: string,
    sortPackages?: boolean,
  ) => Promise<{
    total: number;
    packages: Record<string, number>;
  }>;
  export default getMaintainerDownloads;
}
