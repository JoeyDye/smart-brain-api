const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  // Create hash
  const hash = bcrypt.hashSync(password);
  // Create a transaction
  db.transaction(trx => {
    // Insert user data into login table
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return (
          trx('users')
            // Return all columns
            .returning('*')
            // Insert user data into user table
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then(user => res.json(user[0]))
            // Send transaction through
            .then(trx.commit)
            // Rollback if failed
            .catch(trx.rollback)
        );
      })
      .catch(err => res.status(400).json('Unable to register'));
  });
};

module.exports = {
  handleRegister
};
