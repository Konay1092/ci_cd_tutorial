const app = require("./app");
test("add 1 + 2 to equal 3", () => {
  expect(app.sum(1, 2)).toBe(3);
});
test("add 2 - 1 to equal 1", () => {
  expect(app.sub(2, 1)).toBe(1);
});
