const Messages = require('./models/messages.model')
class MessagesDao{

    async addMessage(user, message){
        try {
            const newMessage = new Messages({ user, message });
            await newMessage.save();
        } catch (error) {
            return error
        }
    }

    async getMessages() {
        try {
           const messages = await Messages.find().exec();
            return messages; 
        } catch (error) {
            return error
        }
        
      }

}

module.exports = MessagesDao