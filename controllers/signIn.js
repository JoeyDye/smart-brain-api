const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  db
    // Get user hash from login table
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    // Use bcrypt to compare user-entered password and hash
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      // If user is valid, respond with user
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('Unable to get user'));
      } else {
        res.status(400).json('Wrong credentials');
      }
    })
    // If request fails, respond with error
    .catch(err => res.status(400).json('Wrong credentials'));
};

module.exports = {
  handleSignin
};
