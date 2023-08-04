async function deleteInactiveUsers() {
    const inactiveUsersThreshold = 30; 
    const inactiveUsers = await Users.getAll().filter(user => {
      const lastConnectionTime = new Date(user.last_connection).getTime();
      const currentTime = Date.now();
      const minutesSinceLastConnection = (currentTime - lastConnectionTime) / (1000 * 60);
      return minutesSinceLastConnection >= inactiveUsersThreshold;
    });
  
    const deletedUsersEmails = inactiveUsers.map(user => user.email);
  
    await Users.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });
  
    return deletedUsersEmails;
  }
  