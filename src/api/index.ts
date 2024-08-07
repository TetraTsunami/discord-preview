import readyClient from "../bot";
import { makeCard } from "../helpers/card";
import { validateId, fetchUserInfo } from "../helpers/discord";
import type { RequestHandler } from "express";

export const discordSelf: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  res.status(200).send(`Discord logged in as ${client.user.username}`);
}

export const discordUser: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  const id = req.params.id;
  if (!validateId(id)) {
    res.status(400).send("Invalid ID");
    return;
  }
  try {
    const user = await fetchUserInfo(client, id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const card = await makeCard(user);
    res.set('Content-Type', 'image/svg+xml')
      .status(200)
      .send(card);
  } catch (error) {
    next(error);
  }
}