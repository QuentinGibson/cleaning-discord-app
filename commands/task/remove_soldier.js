const prisma = require('../../prisma');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove_soldier')
    .setDescription('Remove a soldier from the list of available soldiers.')
    .addUserOption((option) =>
      option
        .setName('soldier')
        .setDescription('User to be added to the list')
        .setRequired(true),
    ),
  async execute(interaction) {
    const userId = interaction.options.getUser('soldier').id;
    const username = interaction.options.getUser('soldier').username;

    try {
      await prisma.soldier.delete({ where: { userId } });
      await interaction.reply({
        content: `${username} was successfully removed from the available list of soldiers.`,
      });
    } catch (e) {
      console.log(e);
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        await interaction.editReply({
          content: 'This user isn\'t in the list! Please select a soldier that is in the list!',
        });
        await interaction.editReply({
          content: `Failed to remove soldier from the list!`,
        });
      }
    };
  }
}


