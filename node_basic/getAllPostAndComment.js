const axios = require("axios");
const fs = require("fs");

const USERS_URL = "https://jsonplaceholder.typicode.com/users";
const POST_URL = "https://jsonplaceholder.typicode.com/posts";
const COMMENTS_URL = "https://jsonplaceholder.typicode.com/comments";

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return;
  }
}

async function getUsersDataWithPostsAndComments() {
  try {
    const [users, posts, comments] = await Promise.all([
      fetchData(USERS_URL),
      fetchData(POST_URL),
      fetchData(COMMENTS_URL),
    ]);

    const usersData = [];

    users.forEach((user) => {
      const userPosts = posts.filter((post) => post.userId === user.id);

      const userComments = comments.filter((comment) => {
        return userPosts.some((post) => post.id === comment.postId);
      });

      const userData = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        comments: userComments,
        posts: userPosts,
      };

      usersData.push(userData);
    });

    return usersData;
  } catch (error) {
    return error;
  }
}
getUsersDataWithPostsAndComments().then((usersData) => {
  if (usersData) {
    fs.writeFileSync("./postAndComment.json", JSON.stringify(usersData));
    console.log(usersData);
  }
});

async function filterUserMoreThreeComment() {
  const users = await getUsersDataWithPostsAndComments();
  console.log(users);
  const response = users.filter((item) => {
    return item?.comments.length > 3;
  });
  return response;
}

// filterUserMoreThreeComment().then((usersData) => {
//   if (usersData) {
//     console.log(usersData);
//   }
// });

async function reformatCommentPost() {
  const users = await getUsersDataWithPostsAndComments();
  const userReformat = [];
  users.forEach((item) => {
    userReformat.push({
      id: item.id,
      name: item.name,
      username: item.username,
      email: item.email,
      commentsCount: item?.comments.length,
      postsCount: item?.posts.length,
    });
  });
  return userReformat;
}

async function getUserWithMostComment() {
  const users = await getUsersDataWithPostsAndComments();
  let userWithMostComments = users[0];
  for (const user of users) {
    if (user.comments.length > userWithMostComments.comments.length) {
      userWithMostComments = user;
    }
  }
  return userWithMostComments;
}

async function sortUserByPost() {
  const users = await reformatCommentPost();
  const usersSort = users.sort((a, b) => {
    b.postsCount - a.postsCount;
  });

  return usersSort;
}

async function getCommentsByPostId(postId = 1) {
  try {
    const postById = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    ).data;
    const conmmentByPostId = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    ).data;
    return {
      postById,
      comments: conmmentByPostId,
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}
