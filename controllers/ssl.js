function getSSLFile(req, res) {
  (req, res) => {
    res.sendFile(
      "/home/ec2-user/todo.io-backend/ssl/F4B98923733B57B85171547E51F4E007.txt"
    );
  };
}

module.exports = getSSLFile;
