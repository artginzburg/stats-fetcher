declare module '@artginzburg/github-user-downloads' {
  const getUserDownloads: (
    username: string,
    auth?: string,
  ) => Promise<{ total: number; data: { name: string; download_count: number }[] }>;
  export default getUserDownloads;
}
