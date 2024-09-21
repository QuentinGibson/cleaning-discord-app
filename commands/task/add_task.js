const {SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle}  = require("discord.js")
const prisma = require("../../prisma/index.js")


module.exports = {
  data: new SlashCommandBuilder()
  .setName("add_task")
  .setDescription("Add a new task to the task list"),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("newTask")
      .setTitle("New Task");

    const nameInput = new TextInputBuilder()
      .setCustomId("taskNameInput")
      .setLabel("New task name")
      .setStyle(TextInputStyle.Short);
    const descriptionIndex = new TextInputBuilder()
      .setCustomId("taskDescriptionInput")
      .setLabel("New task description")
      .setStyle(TextInputStyle.Paragraph);

    const firstRow = new ActionRowBuilder().addComponents(nameInput);
    const secondRow = new ActionRowBuilder().addComponents(descriptionIndex);

    modal.addComponents(firstRow, secondRow);

    console.log("sending modal");

    await interaction.showModal(modal);
  }

}
