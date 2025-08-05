import { templateConfigs } from "./config";

export const templates = Object.fromEntries(
  templateConfigs.map((t) => [t.id, t.component])
);

export { templateConfigs }; 