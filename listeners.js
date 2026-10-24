
const taskEvents = require("./events");


taskEvents.on("task-created", async (data) => {
  try {
    const { title, assignedUser } = data;

    console.log(
      `[Notification started] Task "${title}" | User: ${assignedUser} | ${new Date().toISOString()}`
    );

    // Simulate a slow notification operation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(
      `[Notification completed] Task "${title}" | ${new Date().toISOString()}`
    );
  } catch (error) {
    taskEvents.emit("task-notification-error", error);
  }
});


taskEvents.on("task-deleted", (data) => {
  console.log(
    `[Task Deleted] "${data.title}" | User: ${data.assignedUser} | ${new Date().toISOString()}`
  );
});

// Handle errors reported by background event handlers
taskEvents.on("task-notification-error", (error) => {
  console.error("[Notification Error]", error.message);
});

module.exports = taskEvents;
