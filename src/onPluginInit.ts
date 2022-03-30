import { ParentSpanPluginArgs } from "gatsby";

export function onPluginInit({ reporter }: ParentSpanPluginArgs) {
  return reporter.panic("No hubspot api key");
}
