import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { Alchemy, Utils } from "alchemy-sdk";

dotenv.config();
const openseaData = async (contract_address) => {
  try {
    const options = {
      method: "GET",
      headers: { "X-API-KEY": process.env.OS_API_KEY },
    };
    const response = await fetch(
      `https://api.opensea.io/api/v1/asset_contract/${contract_address}`,
      options
    );
    const data = await response.json();
    const os_collection_slug = data.collection?.slug;
    // console.log(os_collection_slug);
    let collection_name = "";
    let collection_description = "";
    let collection_image = "";
    let collection_website = "";
    let collection_discord = "";
    let collection_twitter = "";
    if (os_collection_slug != null) {
      collection_name = data.name ? data.name : "";
      collection_description = data.description ? data.description : "\u200B";
      collection_image = data.image_url
        ? data.image_url
        : "https://play-lh.googleusercontent.com/ovFbGElmfBf5gqcNhKLDkNIMMf_54hJ02G6lNTQFYsmK4rqwBjKrbl24RiAPOLiVkdk";
      collection_website = data.collection.external_url
        ? data.collection.external_url
        : "";
      collection_discord = data.collection.discord_url
        ? data.collection.external_url
        : "";
      collection_twitter = data.collection.twitter_username
        ? `https://twitter.com/${data.collection.twitter_username}`
        : "";
    }
    const opensea_json = {
      slug: os_collection_slug,
      collection_name: collection_name,
      collection_description: collection_description,
      collection_image: collection_image,
      collection_website: collection_website,
      collection_discord: collection_discord,
      collection_twitter: collection_twitter,
    };
    // console.log("os success");
    return opensea_json;
  } catch (error) {
    // console.log("os failed");
  }
};

export { openseaData };
