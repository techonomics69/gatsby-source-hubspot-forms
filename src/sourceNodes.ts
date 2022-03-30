import axios from "axios";
import type { NodeInput, SourceNodesArgs } from "gatsby";
import { PluginOptions } from "./internal";

export async function sourceNodes(
  { actions: { createNode }, reporter, createContentDigest }: SourceNodesArgs,
  { type, hubspotApiKey }: PluginOptions
) {
  reporter.info("fetching Hubspot Forms");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchAllFormNodes = await axios.get<any[]>(
    `https://api.hubapi.com/forms/v2/forms?hapikey=${hubspotApiKey}`
  );
  const response = fetchAllFormNodes.data;

  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  response.forEach((item) => {
    const formNode: NodeInput = {
      // eslint-disable-next-line
      id: item.guid,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      portalId: item.portalId.toString(),
      guid: item.guid,
      name: item.name,
      action: item.action,
      method: item.method,
      cssClass: item.cssClass,
      redirect: item.redirect,
      submitText: item.submitText,
      followUpId: item.followUpId,
      notifyRecipients: item.notifyRecipients,
      leadNurturingCampaignId: item.leadNurturingCampaignId,
      formFieldGroups: item.formFieldGroups,
      metaData: item.metaData,
      inlineMessage: item.inlineMessage,
      isPublished: item.isPublished,
      thankYouMessageJson: item.thankYouMessageJson,
      children: [],
      parent: `__SOURCE__`,
      internal: {
        type,
        contentDigest: "",
      },
    };
    formNode.internal.contentDigest = createContentDigest(formNode);
    createNode(formNode);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    reporter.verbose(`Creating hubspot form ${item.name} (${item.guid})`);
  });
  /* eslint-enable @typescript-eslint/no-unsafe-member-access */
}
