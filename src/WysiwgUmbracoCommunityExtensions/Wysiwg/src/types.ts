export type SemVersion = {
  major: number;
  minor: number;
  patch: number;
  preRelease?: string;
}

export enum UpdateStatus {
  Unknown,
  UpToDate,
  Update,
  Install
};
