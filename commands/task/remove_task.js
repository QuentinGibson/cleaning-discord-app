const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const prisma = require("../../prisma/index.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove_task")
    .setDescription("Remove a task from the task list"),

  async execute(interaction) {
    const taskList = (await prisma.task.findMany({ take: 100 })).map(
      (task) => ({
        label: task.name,
        description: task.description,
        value: task.id.toString(),
      })
    );

    const nameMenu = new StringSelectMenuBuilder()
      .setCustomId("taskListMenu")
      .setMinValues(1)
      .addOptions(taskList)
      .setPlaceholder("Select a task to be DELETED!");

    const row = new ActionRowBuilder().addComponents(nameMenu);

    console.log("sending menu");

    const response = await interaction.reply({
      content: "Select tasks that will be permanently DELETED!",
      components: [row],
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;

    try {
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 120_000,
      });

      if (confirmation.customId === "taskListMenu") {
        const taskIds = confirmation.values.map((id) => parseInt(id));
        const tasks = await prisma.task.findMany({
          where: { id: { in: taskIds } },
        });
        const taskNames = tasks.map((task) => task.name);
        try {

        await prisma.task.deleteMany({ where: { id: { in: taskIds } } });
        await interaction.editReply({
          content: `Tasks ${taskNames.join(", ")} have been deleted!`,
          components: [],
        });
        } catch (e) {
          console.log(e);
          await interaction.editReply({
            content: `Failed to delete tasks ${taskNames.join(", ")}!`,
            components: [],
          });
        }
      }
    } catch (e) {
      console.log(e);
      await interaction.editReply({
        content: "You took too long to respond! Cancelling...",
        components: [],
      });
    }
  },
};
