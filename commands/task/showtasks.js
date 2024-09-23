
const { SlashCommandBuilder } = require('discord.js');
const AsciiTable = require('ascii-table');
const prisma = require('../../prisma');
const { PrismaClientKnownRequestError } = require('@prisma/client');

function createTable(tasks) {
  const table = new AsciiTable('Tasks');
  table.setHeading('ID', 'Name', 'Description');
  tasks.forEach((task) => {
    table.addRow(task.id, task.name, task.description);
  });
  return table.toString();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('show_tasks')
    .setDescription('Shows all tasks in a table'),
  async execute(interaction) {
    try {
    const tasks = await prisma.task.findMany();
      if (!tasks.length) {
        await interaction.reply({
          content: 'No tasks found',
          ephemeral: true
        })
        return
      }
    const table = createTable(tasks)
    await interaction.reply({
      content: table
    })
    } catch (e) {
      console.log(e);
      await interaction.reply({
        content: 'Failed to show tasks',
        ephemeral: true
      })
    }
  }
}