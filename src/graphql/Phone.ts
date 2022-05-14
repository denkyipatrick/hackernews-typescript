import { enumType, extendType, objectType } from "nexus";

export const OsNameEnum = enumType({
  name: "OsName",
  members: ["android", "ios", "linux", "windows"],
});

export const Phone = objectType({
  name: "Phone",
  definition(t) {
    t.id("id");
    t.nonNull.field("osName", { type: OsNameEnum });
    t.nonNull.string("osVersion");
    t.nonNull.string("manufacturer");
  },
});

export const PhoneQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("phones", {
      type: "Phone",
      resolve() {
        return [];
      },
    });
  },
});
