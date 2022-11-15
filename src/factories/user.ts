import * as faker from "faker";
import { Factory } from "rosie";

export default Factory.define("user").attrs({
  email: () => faker.internet.email(),
  name: () => faker.name.findName(),
});
