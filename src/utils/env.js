const { z } = require("zod");

const _envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  ADMIN_TOKEN: z.string(),
});

const _env = _envSchema.safeParse(process.env);

if (_env.error) {
  console.error("❌ Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}

const env = _env.data;

module.exports = env;
