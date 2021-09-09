import random
import discord
from discord.ext import commands

import logging
logger = logging.getLogger('discord')
logger.setLevel(logging.INFO)
handler = logging.FileHandler(filename='logs/discord.log', encoding='utf-8', mode='w')
logger.addHandler(handler)

client = commands.Bot(command_prefix = '$')
PREFIX = "$"
BOT_TOKEN = "ODg1MTQxODU4NzY0ODY5Njgz.YTiumA.Oj-lIYblObB-TaKYQgFNCgKl81g"

command_list = ["rng", "help"]


async def handle_message(message):
    msg = message.content
    command = msg.split()[0][1:]  # store the command into a variable
    if command not in command_list:
        await message.channel.send("The command '{0}' is not valid! Type {1}help for a "
                                   "list of available commands.".format(command, PREFIX))
    if command == "help":
        return_message = "Available commands are: "
        for cmd in command_list:
            return_message += "{0}, ".format(cmd)
        return_message = return_message.strip(",")
        await message.channel.send(return_message)

    # commands that can handle multiple variables
    if len(msg.split()) > 1:
        if command == "rng":
            min_int = 1
            if len(msg.split()) > 2 and msg.split()[1].isnumeric() and msg.split()[2].isnumeric():
                min_int, max_int = (min([int(num) for num in msg.split()[1:3]]), max([int(num) for num in msg.split()[1:3]]))

            elif len(msg.split()) > 1 and msg.split()[1].isnumeric():
                max_int = int(msg.split()[1])

            rng_result = random.randint(min_int, max_int)
            await message.channel.send("Rolling ({0} - {1}): {2}".format(str(min_int), str(max_int), str(rng_result)))


@client.event  # register the event
async def on_ready():  # going to be called when the bot is ready to be used
    print("Bot logged in as {0}".format(client.user))


@client.event
async def on_message(message):  # these fxn names are from discord.py wrapper
    if message.author == client.user:
        return

    if message.content.startswith(PREFIX):
        await handle_message(message)

@client.command
async def help(ctx):
    await ctx.send('Welcome to ')

client.run(BOT_TOKEN)
