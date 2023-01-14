let users = []

const modifyString = (string) => string.trim().toLowerCase()

const addUser = ({ id, name, room }) => {
  name = modifyString(name)
  room = modifyString(room)

  if (!name || !room) {
    return { error: 'Name  and room is required' }
  }

  if (users.length) {
    const isExistingUser = users.some(
      (user) => user.name === name && user.room === room,
    )

    if (isExistingUser) {
      return { error: 'Name  already exists in this room' }
    }
  }
  const user = { id, name, room }
  users.unshift(user)

  return { error: false }
}

module.exports = addUser
