import db from "./prisma"
import {ActionRowBuilder, Client, GatewayIntentBits, ModalBuilder, REST, Routes, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle} from 'discord.js'

const commands = [
  {
    name: "add_task",
    description: "Add a task to the list.",
  },
  {
    name: "remove_task",
    description: "Delete task from list."
  }
]

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  (async () => {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  })();
} catch (error) {
  console.error(error);
}

client.on('interactionCreate', async (interaction) => {
  if (interaction.commandName === "add_task") {
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

  if (interaction.commandName === "remove_task") {
    const dbTasks = await db.task.findMany({take: 100})
    const taskList = dbTasks.map(task => ({ label: task.name, value: task.id}))
    const modal = new ModalBuilder()
      .setCustomId("removeTask")
      .setTitle("Remove Task");

    const taskMenu = new StringSelectMenuBuilder().setCustomId("taskListMenu").setPlaceholder("Select a task to be DELETED!").options(taskList)

    const firstRow = new ActionRowBuilder().addComponents(taskMenu)

    modal.addComponents(firstRow)

    await interaction.showModal(modal)
  }
});
