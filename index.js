const getIP = require('external-ip')();
const app = require("./server")
const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/rest");

const PORT = 8001;
let globalIP;
getIP((err, ip) => {
  if (err) {
      // every service in the list has failed
      throw err;
  }
  console.log(ip);
  globalIP = ip;
});


async function run() {
  try {
    const githubToken = core.getInput("GITHUB_TOKEN");
    const octokit = new Octokit({ auth: githubToken });
    const customMessage = core.getInput("message");
    const { context } = github;
    const repository = context.payload.repository;

    if (context.payload.review && context.payload.action === "submitted") {
      const issueNumber = context.payload.pull_request.number;
      const reviewComment = context.payload.review.body;
      const reviewObject = context.payload.review;

      const commentAuthor = reviewObject.user.login;

      const message = customMessage
        ? customMessage
        : `Hey @${commentAuthor}! 👋 <br/> You commented ${reviewComment} have a good day🙂`;

      return octokit.issues.createComment({
        owner: repository.owner.login,
        repo: repository.name,
        issue_number: issueNumber,
        body: message,
      });
    }
    if (context.payload.comment) {
      if (
        context.payload.action === "created" ||
        context.payoad.action === "edited"
      ) {
        const issueNumber = context.payload.issue.number;

        // const comment = [context.payload.comment.body];
        const commentObject = context.payload.comment;
        console.log(commentObject.user, "commentObject.user")
        const commentAuthor = commentObject.user.login;
        const comment = commentObject.body;
        const message = customMessage
          ? customMessage
          : `Hey @${commentAuthor}! 👋 <br/> visit https://${globalIP}:${PORT} have a great day🙂`;

        octokit.issues.createComment({
          owner: repository.owner.login,
          repo: repository.name,
          issue_number: issueNumber,
          body: message,
        });
        app.listen(PORT)
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
