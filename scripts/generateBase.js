const fs = require("fs");
const path = require("path");

const Schema = require("../config/lang-schema.json");

/**
 * Generate the definition dictionary
 * @param {*} obj
 * @returns {Map<string, *>} Definitions
 */
const collectDefinitions = (obj) => {
  const definitions = new Map();

  if (Object.keys(obj).includes("definitions")) {
    const keys = Object.keys(obj.definitions);

    keys.forEach((key) => {
      definitions.set(key, obj.definitions[key]);
    });
  }

  return definitions;
};

/**
 * Recursive function accross JSON Schema file
 * @param {*} obj
 * @param {*} result
 * @param {string} pathString
 * @param {Map<string, *>} definitions
 * @returns {*} Result
 */
const recurseGenerate = (obj, result, pathString, definitions) => {
  const keys = Object.keys(obj);

  if (keys.includes("properties")) {
    return recurseGenerate(obj.properties, {}, pathString, definitions);
  }

  if (!keys.includes("type")) {
    keys.forEach((key) => {
      let elem = obj[key];

      if (typeof elem["$ref"] === "string") {
        const refName = elem["$ref"].replace("#/definitions/", "");
        if (definitions.has(refName)) {
          elem = definitions.get(refName);
        }
      }

      if (elem.type === "string") {
        result[key] = `${pathString}${key}`;
      }

      if (elem.type === "object") {
        result[key] = recurseGenerate(
          elem,
          {},
          `${pathString}${key}.`,
          definitions
        );
      }
    });
  }

  return result;
};

const definitions = collectDefinitions(Schema);

/**
 * A JSON corresponding to the JSON Schema
 */
const generated = recurseGenerate(Schema, {}, "", definitions);

/**
 * base.json file path
 */
const target = path.resolve(__dirname, "..", "src", "lang", "base.json");

fs.writeFileSync(target, JSON.stringify(generated, null, 2), {
  encoding: "utf8",
});

console.log(`Generated ${target} file`);
