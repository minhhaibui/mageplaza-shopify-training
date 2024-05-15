const axios = require("axios");
const fs = require("fs");

async function getListTenUser() {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const users = response.data;
    fs.writeFileSync("./users.json", JSON.stringify(users));
  } catch (error) {
    return error;
  }
}

getListTenUser();
