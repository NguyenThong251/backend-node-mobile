import cron from "node-cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get("process.env.URL", (res) => {
      if (res.statusCode === 200) {
        console.log("GET request successful");
      } else {
        console.log("GET request failed");
      }
    })
    .on("error", (error) => {
      console.error(error);
    });
});
export default job;
