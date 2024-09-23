const { SlashCommandBuilder } = require('discord.js');
const prisma = require('../../prisma');
const { PrismaClientKnownRequestError } = require('@prisma/client');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('free_soldier')
    .setDescription('Frees a soldier from all his tasks.')
    .addUserOption((option) => 
      option
        .setName('soldier')
        .setDescription('Soldier to be freed from all tasks')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.options.getUser('soldier').id;
    const username = interaction.options.getUser('soldier').username;
    try {
      await prisma.taskSoldier.deleteMany({ where: { soldierId: userId } });
      await interaction.reply({
        content: `Soldier ${username} freed!`,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        await interaction.reply({
          content: 'Soldier is not assigned to any task!',
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
