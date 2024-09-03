import app from "./config/app";

app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
})
