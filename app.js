import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import prisma from './prisma/index.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction type and data
  const { type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    // Slash command with name of "test"


    if (data.name === "remove_task") {
      // Send a modal as response
      const context = req.body.context
      const userId = context === 0 ? req.body.member.body.user.id : req.body.user.id;
      const objectName = req.body.data.options[0].value;
      console.log('sending modal')
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `hello world ${getRandomEmoji()}`,
        },
      });
    }

    if (data.name === 'add_task') {

      console.log('sending modal')
      return res.send({
        type: InteractionResponseType.MODAL,
        data: {
          custom_id: "my_modal",
          title: "New Task",
          components: [
            {
              // Text inputs must be inside of an action component
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  // See https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: 'task_name',
                  style: 1,
                  label: "Task Name",
                },
              ],
            },
{
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: 'task_description',
                  style: 2,
                  label: 'Task Description',
                },
              ],
            },
          ],
        },
      });
    }
  }

  /**
   * Handle modal submissions
   */
  if (type === InteractionType.MODAL_SUBMIT) {
    // custom_id of modal
    const modalId = data.custom_id;
    // user ID of member who filled out modal
    const userId = req.body.member.user.id;

    if (modalId === "my_modal") {
      let modalValues = "";
      // Get value of text inputs
      let taskName;
      let taskDescription;
      for (let action of data.components) {
        let inputComponent = action.components[0];
        modalValues += `${inputComponent.custom_id}: ${inputComponent.value}\n`;
        if (inputComponent.custom_id === "task_name") {
          taskName = inputComponent.value;
        }
        if (inputComponent.custom_id === "task_description") {
          taskDescription = inputComponent.value;
        }
      }

      console.log("checking for input");
      if (taskName && taskDescription) {
        console.log("Both exists");
        await prisma.task.create({
          data: {
            name: taskName,
            description: taskDescription,
          },
        });
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `<@${userId}> typed the following (in a modal):\n\n${modalValues}`,
        },
      });
    }
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
