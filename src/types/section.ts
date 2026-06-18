import type { SectionId } from "./post";

export interface Section {
  id: SectionId;
  icon: string;
  color: string;
  route: string;
}
