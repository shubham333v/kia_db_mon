require("@babel/core").transformSync("code", {
    plugins: ["@babel/plugin-transform-react-jsx-development"],
  });