import { extendType, nonNull, objectType, stringArg } from "nexus";
import * as jwt from "jsonwebtoken";
import * as bcryptjs from "bcryptjs";
import { APP_SECRET } from "../utils/auth";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token");
    t.nonNull.field("user", {
      type: "User",
    });
  },
});

export const LoginMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signin", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const user = await context.prisma.user.findUnique({
          where: { email: args.email },
        });

        if (!user) {
          throw new Error("User is not found");
        }

        const valid = await bcryptjs.compare(args.password, user.password);

        if (!valid) {
          throw new Error("Wrong password");
        }

        const token = jwt.sign({ userId: user?.id }, APP_SECRET);

        return { user, token };
      },
    });
  },
});

export const SignUpMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { email, name } = args;

        const password = await bcryptjs.hash(args.password, 10);

        const user = await context.prisma.user.create({
          data: { email, name, password },
        });

        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        return { user, token };
      },
    });
  },
});
