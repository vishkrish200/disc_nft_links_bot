import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import * as dotenv from "dotenv";
import fetchVars from "./contractVars.js";
import { ethers } from "ethers";
import fetch from "node-fetch";
import http from "http";
import { Alchemy, Utils } from "alchemy-sdk";

dotenv.config();

// const hostname = "0.0.0.0";
// const port = 8080;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   res.end("The server has started");
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("0x")) {
    try {
      const contract_address = message.content.slice(0, 42);
      const options = {
        method: "GET",
        headers: { "X-API-KEY": process.env.OS_API_KEY },
      };
      const response = await fetch(
        `https://api.opensea.io/api/v1/asset_contract/${message.content}`,
        options
      );
      const data = await response.json();
      const os_collection_slug = data.collection?.slug;
      // console.log(os_collection_slug);
      let collection_name = "";
      let collection_description = "";
      let collection_website = "";
      let collection_discord = "";
      let collection_twitter = "";
      if (os_collection_slug != null) {
        collection_name = data.name ? data.name : "";
        collection_description = data.description ? data.description : "";
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
      const values = await fetchVars(contract_address);
      // console.log(values);

      const embed = new EmbedBuilder()
        .setColor(0x51ff00)
        .setTitle(`${collection_name ? collection_name : "No Name"}`)
        .setDescription(
          `${
            collection_description ? collection_description : "No Descriptino"
          }`
        )
        .setThumbnail(
          `${
            data.image_url
              ? data.image_url
              : "https://play-lh.googleusercontent.com/ovFbGElmfBf5gqcNhKLDkNIMMf_54hJ02G6lNTQFYsmK4rqwBjKrbl24RiAPOLiVkdk"
          }`
        )
        .addFields({
          name: "Contract Address",
          value: `${contract_address}`,
        })
        .addFields({
          name: "Contract Variables",
          value:
            "--------------------------------------------------------------------",
        })
        .setTimestamp()
        .setFooter({
          text: "by your fat mom",
          iconURL:
            "https://play-lh.googleusercontent.com/ovFbGElmfBf5gqcNhKLDkNIMMf_54hJ02G6lNTQFYsmK4rqwBjKrbl24RiAPOLiVkdk",
        });
      values.forEach((item) => {
        embed.addFields({
          name: `${item.name ? item.name : "empty"}`,
          value: `${item.value ? item.value : "empty  "}`,
          inline: true,
        });
      });
      embed.addFields({
        name: "\u200B",
        value:
          "--------------------------------------------------------------------",
      });
      embed
        .addFields({
          name: `Links`,
          value: ` [Etherscan](https://etherscan.io/address/${
            message.content
          }) | [NFTNerds](https://nftnerds.ai/collection/${
            message.content
          }/liveview) | [Blur](https://blur.io/collection/${
            message.content
          }) | [Opensea](https://opensea.io/collection/${
            os_collection_slug ? os_collection_slug : ""
          }) | [X2Y2](https://x2y2.io/collection/${
            message.content
          }) | [Degenmint](https://degenmint.xyz/?address=${message.content})`,
        })
        .addFields({
          name: `Collection Links`,
          value: ` [Website](${collection_website}) | [Twitter](${collection_twitter}) | [Discord](${collection_discord})`,
        });
      message.reply({ embeds: [embed] });
      console.log("success");
    } catch (error) {
      console.log("fail");
      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("An Error Occured")
        .setDescription(
          "Either \nthe contract entered is invalid \ncollection does not have an os page\npls contact SlimyLemon#8762"
        )
        .setTimestamp()
        .setFooter({
          text: "by your fat mom",
          iconURL:
            "https://play-lh.googleusercontent.com/ovFbGElmfBf5gqcNhKLDkNIMMf_54hJ02G6lNTQFYsmK4rqwBjKrbl24RiAPOLiVkdk",
        });
      message.reply({ embeds: [errorEmbed] });
    }
  }
});

client.login(process.env.DISC_BOT_TOKEN);
