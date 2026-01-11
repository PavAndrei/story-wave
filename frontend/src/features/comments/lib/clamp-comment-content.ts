import { MAX_COMMENT_LENGTH } from "../constants";

export const clampCommentContent = (value: string) =>
  value.slice(0, MAX_COMMENT_LENGTH);
