const { SlashCommandBuilder } = require('discord.js');
const { PrismaClientKnownRequestError } = require('@prisma/client');
const prisma = require('../../prisma');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add_soldier')
    .setDescription('Add a discord user to the list of available soldiers.')
    .addUserOption((option) => 
      option
        .setName('soldier')
        .setDescription('User to be added to the list')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.options.getUser('soldier').id;
    const username = interaction.options.getUser('soldier').username;
    try {
      await prisma.soldier.create({ data: { userId, username } });
      await interaction.reply({
        content: 'Soldier added to the list!',
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        await interaction.reply({
          content: 'This user is already in the list of soldiers!',
        });
      } else {
        console.log(e);
        await interaction.reply({
          content: 'Failed to add soldier to the list!',
        });
      }
    }
  },
};
