## Practical 6 – Full-Stack Task Manager Integration

### Objective

Connect the React frontend with the Node.js, Express, and MongoDB backend to perform complete CRUD operations.

### Technologies Used

- React
- React Router
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API
- Fetch API
- CORS

### Architecture

React Frontend → REST API → Express Backend → Mongoose → MongoDB

### Features

- View tasks from MongoDB
- Create new tasks
- Update existing tasks
- Delete tasks
- Search/filter tasks
- Loading state while fetching data
- Error handling for API operations
- Retry option when fetching fails
- Delete confirmation dialog
- Toast notifications after successful operations
- Data persistence using MongoDB

### Frontend Setup

```bash
npm install
npm run dev

## Practical 10: Asynchronous Processing with Event-Driven Architecture

### Objective
Implement Node.js's native `EventEmitter` to handle task notifications asynchronously without delaying API responses.

### Implementation
- Created `events.js` to export a custom EventEmitter instance.
- Created `listeners.js` to handle task-related events.
- Emitted the `task-created` event after successfully creating a task.
- Emitted the `task-deleted` event after successfully deleting a task.
- Simulated a slow notification operation using a 2-second delay.
- Added error handling for asynchronous notification failures.
- Preserved Practical 9 caching by invalidating the task cache after create and delete operations.

### API Endpoints Tested
- `POST /tasks` — Creates a task and triggers a background notification.
- `DELETE /tasks/:id` — Deletes a task and triggers a deletion notification.

### Expected Results
- Task creation and deletion return API responses without waiting for their notification handlers to finish.
- The terminal logs event activity and timestamps.
- Notification errors are caught and logged.

### Conclusion
Event-driven architecture separates task API operations from notification processing, improving responsiveness and maintainability.