const { Octokit } = require("@octokit/core");
const octokit = new Octokit({});

const fecthAllComments = async () => {
  const repos = await getAllRepos();
  let comments = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const d = await fetchCommentsFromRepo(repo);
    comments = [...comments, d];
  }
  // console.log(comments);
  return comments;
};

const getAllRepos = async () => {
  const repos = await octokit.request("GET /users/{username}/repos", {
    username: "ElixirTechCommunity"
  });
  const hactoberRepos = repos.data.filter(
    (item) => new Date(item.created_at) > new Date("2022-10-10")
  );
  return hactoberRepos.map((item) => item.name);
};

const fetchCommentsFromRepo = async (repo) => {
  const data = await octokit.request(
    "GET /repos/{owner}/{repo}/issues/comments",
    {
      owner: "ElixirTechCommunity",
      repo
    }
  );
  return normaliseData(data.data, repo);
};

const normaliseData = (data, repo) => {
  const comments = data.map((item) => ({
    user: item.user.login,
    message: item.body,
    issue_url: item.issue_url
  }));
  const normalisedDate = { repository: repo, comments: comments };
  return normalisedDate;
};
