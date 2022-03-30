import { ObjectSchema } from "gatsby-plugin-utils";
import { PluginOptionsSchemaArgs } from "gatsby";

export function pluginOptionsSchema(
  args: PluginOptionsSchemaArgs
): ObjectSchema {
  const { Joi } = args;
  return Joi.object({
    hubspotApiKey: Joi.string()
      .description("API key for using the Hubspot apis")
      .required(),
    type: Joi.string()
      .description("Type for the nodes (default is HubspotForm)")
      .default("HubspotForm"),
  });
}
