const onlineDb = process.env.DATABASE;
const localDb = process.env.DATABASE_LOCAL;
const onlineDbPassword = process.env.DATABASE_PASSWORD;
const parsedOnlineDb = onlineDb.replace(
  "<PASSWORD>",
  onlineDbPassword,
);

/**
 * Retrieves the appropriate database URL based on the provided options.
 * @param {Object} [option] - Options object (default: { localDb: true })
 * @param {boolean} [option.localDb=true] - Indicates whether to use the local database URL.
 * @returns {string} - The database URL based on the specified options.
 * @throws {Error} - Throws an error if the local or online database URL is not available or valid.
 */

export default function getDatabaseUrl(
  option = { localDb: true },
) {
  if (option.localDb) {
    if (!localDb) {
      throw new Error(
        "There is no local Database in the env process.",
      );
    }
    return localDb;
  }

  if (!onlineDb || onlineDbPassword) {
    throw new Error(
      "Online DB URL is not valid or Online DB password is missing",
    );
  }
  return parsedOnlineDb;
}
