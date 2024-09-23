const { SlashCommandBuilder } = require('discord.js');
const prisma = require('../../prisma');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('assign')
    .setDescription('Assigns a soldiers to task by id')
    .addUserOption((option) =>
      option
        .setName('soldier')
        .setDescription('Soldier to be assigned to a task')
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('task-id')
        .setDescription('ID of the task for the soldier')
        .setRequired(true),
    ),

  async execute(interaction) {
    const taskId = interaction.options.getInteger('task-id');
    const user = interaction.options.getUser('soldier');

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      await interaction.reply({ content: 'Task not found!', ephemeral: true });
      return;
    }

    let soldier = await prisma.soldier.findUnique({
      where: { userId: user.id },
    });

    if (!soldier) {
      soldier = await prisma.soldier.create({
        data: {
          userId: user.id,
          username: user.username,
        },
      });
    }

    const existingAssignment = await prisma.taskSoldier.findUnique({
      where: {
        taskId_soldierId: {
          taskId: task.id,
          soldierId: soldier.id,
        },
      },
    });

    if (existingAssignment) {
      await interaction.reply({
        content: `${user.username} is already assigned to this task.`,
        ephemeral: true,
      });
      return;
    }

    await prisma.taskSoldier.create({
      data: {
        taskId: task.id,
        soldierId: soldier.id,
      },
    });

    await interaction.reply({
      content: `Assigned ${user.username} to task ${task.name}.`,
      ephemeral: true,
    });
  },
};
