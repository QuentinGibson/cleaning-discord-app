const { SlashCommandBuilder } = require('discord.js');
const { PrismaClientKnownRequestError } = require('@prisma/client');
const prisma = require('../../prisma');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add_soldier')
    .setDescription('Add a discord user to the list of availble soldiers.')
    .addUserOption((option) => {
      option
        .setName('soldier')
        .setDescription('User to be added to the list')
        .setRequired(true);
    }),

  async execute(interation) {
    const userId = interation.options.getUser('soldier');
    try {
      await prisma.soldier.create({ data: { userId } });
      await interation.reply({
        content: 'Soldier added to the list!',
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        await interation.reply({
          content: 'This user is already in the list of soldiers!',
        });
      } else {
        console.log(e);
        await interation.reply({
          content: 'Failed to add soldier to the list!',
        });
      }
    }
  },
};
