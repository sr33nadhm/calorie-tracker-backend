import * as faker from "faker";
import { Factory } from "rosie";

export default Factory.define("meal").attrs({
  name: () => faker.commerce.productName(),
  date: faker.date.betweens(
    "2020-01-01T00:00:00.000Z",
    "2030-01-01T00:00:00.000Z"
  ),
});
