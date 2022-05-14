import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";

export const Vote = objectType({
  name: "Vote",
  definition(t) {
    t.nonNull.field("link", { type: "Link" });
    t.nonNull.field("user", { type: "User" });
  },
});

export const VoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("vote", {
      type: "Vote",
      args: {
        linkId: nonNull(intArg()),
      },
      async resolve(parent, args, context) {
        const { userId, prisma } = context;
        const { linkId } = args;

        if (!userId) {
          throw new Error("Unauthorized. Please login first.");
        }

        const link = await prisma.link.update({
          where: { id: linkId },
          data: {
            voters: {
              connect: { id: userId },
            },
          },
        });

        const user = await prisma.user.findUnique({ where: { id: userId } });

        return {
          link,
          user,
        };
      },
    });
  },
});
