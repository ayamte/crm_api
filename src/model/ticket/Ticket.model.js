const { TicketSchema } = require("./Ticket.schema");

const insertTicket = async (ticketObj) => {
  try {
    const ticket = new TicketSchema(ticketObj);
    const data = await ticket.save();
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};


const getTickets = async (clientId) => {
  try {
    const data = await TicketSchema.find({ clientId });
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};


const getTicketById = async (_id, clientId) => {
  try {
    const data = await TicketSchema.find({ _id, clientId });
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};


const updateClientReply = async ({ _id, message, sender }) => {
  try {
    const data = await TicketSchema.findOneAndUpdate(
      { _id },
      {
        status: "Pending operator response",
        $push: {
          conversations: { message, sender },
        },
      },
      { new: true }
    );
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};


const updateStatusClose = async ({ _id, clientId }) => {
  try {
    const data = await TicketSchema.findOneAndUpdate(
      { _id, clientId },
      {
        status: "Closed",
      },
      { new: true }
    );
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};


const deleteTicket = async ({ _id, clientId }) => {
  try {
    const data = await TicketSchema.findOneAndDelete({ _id, clientId });
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};


module.exports = {
  insertTicket,
  getTickets,
  getTicketById,
  updateClientReply,
  updateStatusClose,
  deleteTicket,
};