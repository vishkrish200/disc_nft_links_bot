import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import * as dotenv from "dotenv";
import fetchVars, { contract_name, cost } from "./contract-vars.js";

import { ethers } from "ethers";
import fetch from "node-fetch";
import http from "http";
import { Alchemy, Utils } from "alchemy-sdk";
import { openseaData } from "./opensea-data.js";

dotenv.config();

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
      if (message.content.startsWith("0x")) {
        const contract_address = message.content.slice(0, 42);
        const values = await fetchVars(contract_address);
        const opensea_json = await openseaData(contract_address);
        // console.log(contract_name);
        // console.log(opensea_json.collection_name);
        // console.log(values);
        // console.log("in" + opensea_json.collection_image);
        const embed = new EmbedBuilder()
          .setColor(0x51ff00)
          .setTitle(
            opensea_json.collection_name
              ? opensea_json.collection_name
              : contract_name
          )
          // .setDescription(`${opensea_json.collection_description}`)
          .setThumbnail(opensea_json.collection_image)
          .addFields({
            name: "Contract Address",
            value: "`" + contract_address + "`",
          })
          .addFields({
            name: "Contract Variables",
            value:
              "--------------------------------------------------------------------",
          })
          // .addFields({
          //   name: "Contract Variables",
          //   value: "\u200B",
          // })
          // .addFields({
          //   name: "Cost",
          //   value: cost,
          // })
          .setTimestamp()
          .setFooter({
            text: "by your fat mom",
            iconURL:
              "https://play-lh.googleusercontent.com/ovFbGElmfBf5gqcNhKLDkNIMMf_54hJ02G6lNTQFYsmK4rqwBjKrbl24RiAPOLiVkdk",
          });
        // console.log(values);
        values?.forEach((item, index) => {
          if (index < 20) {
            embed.addFields({
              name: item.name ? item.name : "empty",
              value: "`" + `${item.value ? item.value : "empty"}` + "`",
              inline: true,
            });
          }
        });
        embed.addFields({
          name: "\u200B",
          value:
            "--------------------------------------------------------------------",
        });
        embed
          .addFields({
            name: `Links`,
            value: ` [Etherscan](https://etherscan.io/address/${contract_address}) | [NFTNerds](https://nftnerds.ai/collection/${contract_address}/liveview) | [Blur](https://blur.io/collection/${contract_address}) | [Opensea](https://opensea.io/collection/${
              opensea_json.slug ? opensea_json.slug : ""
            }) | [X2Y2](https://x2y2.io/collection/${contract_address}) | [Degenmint](https://catchmint.xyz/?address=${contract_address}) | [AlphaSharks](https://v2-beta.alphasharks.io/collection/${contract_address}) | [mint.fun](https://mint.fun/${contract_address})`,
          })
          .addFields({
            name: `Collection Links`,
            value: ` [Website](${opensea_json.collection_website}) | [Twitter](${opensea_json.collection_twitter}) | [Discord](${opensea_json.collection_discord})`,
          });
        message.reply({ embeds: [embed] });
      }
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

// client.on("messageCreate", async (message) => {
//   if (message.author.bot) return;

//   if (message.content.startsWith("0x")) {
//     const contract_address = message.content.slice(0, 42);
//     const values = await fetchVars(contract_address);
//     const opensea_json = await openseaData(contract_address);
//     // console.log(contract_name);
//     // console.log(opensea_json.collection_name);
//     // console.log(values);
//     // console.log("in" + opensea_json.collection_image);
//     const embed = new EmbedBuilder()
//       .setColor(0x51ff00)
//       .setTitle(
//         opensea_json.collection_name
//           ? opensea_json.collection_name
//           : contract_name
//       )
//       // .setDescription(`${opensea_json.collection_description}`)
//       .setThumbnail(opensea_json.collection_image)
//       .addFields({
//         name: "Contract Address",
//         value: "`" + contract_address + "`",
//       })
//       .addFields({
//         name: "Contract Variables",
//         value:
//           "--------------------------------------------------------------------",
//       })
//       // .addFields({
//       //   name: "Contract Variables",
//       //   value: "\u200B",
//       // })
//       // .addFields({
//       //   name: "Cost",
//       //   value: cost,
//       // })
//       .setTimestamp()
//       .setFooter({
//         text: "by your fat mom",
//         iconURL:
//           "https://play-lh.googleusercontent.com/ovFbGElmfBf5gqcNhKLDkNIMMf_54hJ02G6lNTQFYsmK4rqwBjKrbl24RiAPOLiVkdk",
//       });
//     // console.log(values);
//     values?.forEach((item, index) => {
//       if (index < 20) {
//         embed.addFields({
//           name: item.name ? item.name : "empty",
//           value: "`" + `${item.value ? item.value : "empty"}` + "`",
//           inline: true,
//         });
//       }
//     });
//     embed.addFields({
//       name: "\u200B",
//       value:
//         "--------------------------------------------------------------------",
//     });
//     embed
//       .addFields({
//         name: `Links`,
//         value: ` [Etherscan](https://etherscan.io/address/${contract_address}) | [NFTNerds](https://nftnerds.ai/collection/${contract_address}/liveview) | [Blur](https://blur.io/collection/${contract_address}) | [Opensea](https://opensea.io/collection/${
//           opensea_json.slug ? opensea_json.slug : ""
//         }) | [X2Y2](https://x2y2.io/collection/${contract_address}) | [Degenmint](https://catchmint.xyz/?address=${contract_address}) | [AlphaSharks](https://v2-beta.alphasharks.io/collection/${contract_address}) | [mint.fun](https://mint.fun/${contract_address})`,
//       })
//       .addFields({
//         name: `Collection Links`,
//         value: ` [Website](${opensea_json.collection_website}) | [Twitter](${opensea_json.collection_twitter}) | [Discord](${opensea_json.collection_discord})`,
//       });
//     message.reply({ embeds: [embed] });
//   }
// });
client.login(process.env.DISC_BOT_TOKEN);
