const fs = require('fs');
const path = require('path');

const { Events, Client, GatewayIntentBits, Collection } = require('discord.js');
const prisma = require('./prisma');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.GuildMessages],
});

client.login(process.env.DISCORD_TOKEN);

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  }

  if (interaction.isModalSubmit()) {
    console.log('Modal submit detected');

    if (interaction.customId.startsWith('editTaskModal')) {
      console.log(`Edit task modal submited`);
      const taskId = parseInt(interaction.customId.split('_')[1]);
      const taskName =
        interaction.fields.getTextInputValue('editTaskNameInput');
      const taskDescription = interaction.fields.getTextInputValue(
        'editDescriptionInput',
      );

      try {
        await prisma.task.update({
          where: { id: taskId },
          data: { name: taskName, description: taskDescription },
        });
        await interaction.reply({
          content: `Task ${taskId} updated successfully!`,
        });
      } catch (e) {
        console.log(e);
        await interaction.editReply({
          content: 'Failed to add task!',
          components: [],
        });
      }
    }

    if (interaction.customId === 'newTask') {
      console.log(`Add task modal submited`);
      const taskName = interaction.fields.getTextInputValue('taskNameInput');
      const taskDescription = interaction.fields.getTextInputValue(
        'taskDescriptionInput',
      );

      try {
        console.log(`Task name: ${taskName}.`, `Executing save!`);
        await prisma.task.create({
          data: {
            name: taskName,
            description: taskDescription,
          },
        });
        await interaction.reply({
          content: `Added new task, ${taskName}!`,
        });
      } catch (e) {
        console.log(e);
        await interaction.editReply({
          content: 'Failed to add task!',
          components: [],
        });
      }
    }
  }
});
