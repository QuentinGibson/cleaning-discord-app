const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
} = require("discord.js");
const prisma = require("../../prisma");
const { TextStyleTypes } = require("discord-interactions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("edit_task")
    .setDescription("Edit a task from the task list")
    .addIntegerOption((option) =>
      option
        .setName("task-id")
        .setDescription("The id of the task to be edited")
        .setRequired(true)
    ),

  async execute(interaction) {
    const taskId = interaction.options.getInteger("task-id");
    const task = await prisma.task.findUniqueOrThrow({
      where: { id: taskId },
    });
    console.log(taskId)

    // Show the modal with pre-filled fields
    const modal = new ModalBuilder()
      .setCustomId(`editTaskModal_${taskId}`)
      .setTitle("Edit Task");


    const editNameInput = new TextInputBuilder()
      .setCustomId("editTaskNameInput")
      .setLabel("Task Name")
      .setRequired(true)
      .setValue(task.name)
      .setStyle(TextStyleTypes.SHORT)

    const editDescriptionInput = new TextInputBuilder()
      .setCustomId("editDescriptionInput")
      .setLabel("Task Description")
      .setRequired(true)
      .setValue(task.description)
      .setStyle(TextStyleTypes.PARAGRAPH)

    const firstRow = new ActionRowBuilder().addComponents(editNameInput);
    const secondRow = new ActionRowBuilder().addComponents(
      editDescriptionInput
    );
    

    modal.addComponents(firstRow, secondRow);

    await interaction.showModal(modal);
  },
};
