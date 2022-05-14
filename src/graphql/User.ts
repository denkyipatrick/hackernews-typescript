import { extendType, objectType } from "nexus";

export const user = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.list.nonNull.field("links", {
      type: "Link",
      resolve(parent, args, context) {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .links();
      },
    });
    t.nonNull.list.nonNull.field("votes", {
      type: "Link",
      resolve(parent, args, context) {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .votes();
      },
    });
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("user", {
      type: "User",
      resolve(root, args, context) {
        return context.prisma.user.findMany();
      },
    });
  },
});
