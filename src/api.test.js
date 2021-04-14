const request = require("supertest");
const path = require("path");
const fs = require("fs");
const phpServer = require("php-server");
const mysql = require("mysql");

const token_user1 = "2a511bc19f133cd39cac88881dfcc374";
const token_user2 = "NULL";
const token_user3 = "2a511bc19f133cd39cac88881dfcc376";

const authorization_user1 = `Bearer ${token_user1}`;
const authorization_user2 = `Bearer ${token_user2}`;
const authorization_user3 = `Bearer ${token_user3}`;

const Unauthorized = { message: "Unauthorized" };
const BadRequest = { message: "Bad Request" };

const expectedData = require("../test/data.json");

const app = "http://localhost:8080";

describe("REST API Tests", () => {
  let initialized = false;
  let phpServerInstance;
  let mysqlServerInstance;
  let databaseSchema;

  const executeSQLQuery = (queryString) => {
    return new Promise(async (resolve, reject) => {
      mysqlServerInstance.query(queryString, (error, results, fields) => {
        if (error) {
          return reject(error);
        }

        resolve(results[0]);
      });
    });
  };

  const setupServer = () => {
    return new Promise(async (resolve) => {
      phpServerInstance = await phpServer({
        port: 8080,
        base: path.resolve(__dirname, "..", "backend"),
      });

      databaseSchema = fs.readFileSync(
        path.resolve(__dirname, "..", "test", "test.sql"),
        { encoding: "utf8" }
      );

      mysqlServerInstance = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        multipleStatements: true,
      });

      mysqlServerInstance.connect();

      initialized = true;
      resolve();
    });
  };

  beforeAll(() => {
    return setupServer();
  }, 60000);

  beforeEach(() => {
    mysqlServerInstance.query(databaseSchema);
  });
  afterAll(() => {
    phpServerInstance.stop();
    mysqlServerInstance.end();
  });

  it("should test that the server in initialized", () => {
    expect(initialized).toBe(true);
  });

  describe("Index Router", () => {
    it("should get /", async () => {
      const res = await request(app).get("/").send();
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({});
    });
  });

  describe("Account Router", () => {
    describe("API Request GET /account", () => {
      it("should get /account without auth", async () => {
        const res = await request(app).get("/account").send();
        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });

      it("should get /account with auth of user1", async () => {
        const res = await request(app)
          .get("/account")
          .set("Authorization", authorization_user1)
          .send();

        expect(res.status).toEqual(200);
        expect(res.body).toEqual(expectedData.user1.account);
      });

      it("should get /account with auth of user2", async () => {
        const res = await request(app)
          .get("/account")
          .set("Authorization", authorization_user2)
          .send();

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });

      it("should get /account with auth of user3", async () => {
        const res = await request(app)
          .get("/account")
          .set("Authorization", authorization_user3)
          .send();

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });
    });
  });

  describe("Artifact Router", () => {
    describe("API Request GET /artifact", () => {
      it("should get /artifact without auth", async () => {
        const res = await request(app).get("/artifact").send();
        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });

      it("should get /artifact with auth of user1", async () => {
        const res = await request(app)
          .get("/artifact")
          .set("Authorization", authorization_user1)
          .send();

        expect(res.status).toEqual(200);
        expect(res.body).toEqual(expectedData.user1.artifact);
      });

      it("should get /artifact with auth of user2", async () => {
        const res = await request(app)
          .get("/artifact")
          .set("Authorization", authorization_user2)
          .send();

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });

      it("should get /artifact with auth of user3", async () => {
        const res = await request(app)
          .get("/artifact")
          .set("Authorization", authorization_user3)
          .send();

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });
    });

    describe("API Request DELETE /artifact/:id", () => {
      const requestUrl = "/artifact/1";
      const sqlBefore =
        "SELECT count(*) AS nbBefore FROM artifacts WHERE deleted_at IS NULL";
      const sqlAfter =
        "SELECT count(*) AS nbAfter FROM artifacts WHERE deleted_at IS NULL";

      it("should delete not delete /artifact/1 without auth", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);

        const res = await request(app).delete(requestUrl).send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
        expect(nbBefore).toBe(nbAfter);
      });

      it("should delete /artifact/1 with auth of user1", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const res = await request(app)
          .delete(requestUrl)
          .set("Authorization", authorization_user1)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ deleted_id: 1 });
        expect(nbAfter).toBe(nbBefore - 1);
      });

      it("should not delete /artifact/51 with auth of user2", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const res = await request(app)
          .delete("/artifact/51")
          .set("Authorization", authorization_user1)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(400);
        expect(res.body).toEqual(BadRequest);
        expect(nbBefore).toBe(nbAfter);
      });

      it("should not delete /artifact/1 with auth of user2", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const res = await request(app)
          .delete(requestUrl)
          .set("Authorization", authorization_user2)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
        expect(nbBefore).toBe(nbAfter);
      });

      it("should not delete /artifact/2 with auth of user3", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const res = await request(app)
          .delete(requestUrl)
          .set("Authorization", authorization_user3)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
        expect(nbBefore).toBe(nbAfter);
      });
    });
  });

  describe("Champion Router", () => {
    describe("API Request GET /champion", () => {
      it("should get /champion without auth", async () => {
        const res = await request(app).get("/champion").send();
        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });

      it("should get /champion with auth of user1", async () => {
        const res = await request(app)
          .get("/champion")
          .set("Authorization", authorization_user1)
          .send();

        expect(res.status).toEqual(200);
        expect(res.body).toEqual(expectedData.user1.champion);
      });

      it("should get /champion with auth of user2", async () => {
        const res = await request(app)
          .get("/champion")
          .set("Authorization", authorization_user2)
          .send();

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });

      it("should get /champion with auth of user3", async () => {
        const res = await request(app)
          .get("/champion")
          .set("Authorization", authorization_user3)
          .send();

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });
    });

    describe("API Request DELETE /champion/:id", () => {
      const requestUrl = "/champion/1";
      const sqlBefore =
        "SELECT count(*) AS nbBefore FROM champions WHERE deleted_at IS NULL";
      const sqlAfter =
        "SELECT count(*) AS nbAfter FROM champions WHERE deleted_at IS NULL";

      it("should delete not delete /champion/1 without auth", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);

        const res = await request(app).delete(requestUrl).send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
        expect(nbBefore).toBe(nbAfter);
      });

      it("should delete /champion/1 with auth of user1", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const { nbArtifactsBefore } = await executeSQLQuery(
          "SELECT count(*) AS nbArtifactsBefore FROM artifacts WHERE champion_id = 1"
        );
        const { nbConfigurationsBefore } = await executeSQLQuery(
          "SELECT count(*) AS nbConfigurationsBefore FROM configurations WHERE champion_id = 1 AND deleted_at IS NULL"
        );

        const res = await request(app)
          .delete(requestUrl)
          .set("Authorization", authorization_user1)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);
        const { nbArtifactsAfter } = await executeSQLQuery(
          "SELECT count(*) AS nbArtifactsAfter FROM artifacts WHERE champion_id = 1"
        );
        const { nbConfigurationsAfter } = await executeSQLQuery(
          "SELECT count(*) AS nbConfigurationsAfter FROM configurations WHERE champion_id = 1 AND deleted_at IS NULL"
        );

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ deleted_id: 1 });
        expect(nbAfter).toBe(nbBefore - 1);
        expect(nbArtifactsAfter).toBe(nbArtifactsBefore - 6);
        expect(nbConfigurationsAfter).toBe(nbConfigurationsBefore - 1);
        expect(nbAfter).toBe(nbBefore - 1);
      });

      it("should not delete /champion/11 with auth of user1", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const { nbArtifactsBefore } = await executeSQLQuery(
          "SELECT count(*) AS nbArtifactsBefore FROM artifacts WHERE champion_id = 11"
        );
        const { nbConfigurationsBefore } = await executeSQLQuery(
          "SELECT count(*) AS nbConfigurationsBefore FROM configurations WHERE champion_id = 11 AND deleted_at IS NULL"
        );

        const res = await request(app)
          .delete("/champion/11")

          .set("Authorization", authorization_user1)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);
        const { nbArtifactsAfter } = await executeSQLQuery(
          "SELECT count(*) AS nbArtifactsAfter FROM artifacts WHERE champion_id = 11"
        );
        const { nbConfigurationsAfter } = await executeSQLQuery(
          "SELECT count(*) AS nbConfigurationsAfter FROM configurations WHERE champion_id = 11 AND deleted_at IS NULL"
        );

        expect(res.status).toEqual(400);
        expect(res.body).toEqual(BadRequest);
        expect(nbBefore).toBe(nbAfter);
        expect(nbArtifactsBefore).toBe(nbArtifactsAfter);
        expect(nbConfigurationsBefore).toBe(nbConfigurationsAfter);
      });

      it("should not delete /champion/1 with auth of user2", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const res = await request(app)
          .delete(requestUrl)
          .set("Authorization", authorization_user2)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
        expect(nbBefore).toBe(nbAfter);
      });

      it("should not delete /champion/2 with auth of user3", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const res = await request(app)
          .delete(requestUrl)
          .set("Authorization", authorization_user3)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
        expect(nbBefore).toBe(nbAfter);
      });
    });
  });

  describe("Config Router", () => {
    describe("API Request GET /config", () => {
      it("should get /config without auth", async () => {
        const res = await request(app).get("/config").send();
        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });

      it("should get /config with auth of user1", async () => {
        const res = await request(app)
          .get("/config")
          .set("Authorization", authorization_user1)
          .send();

        expect(res.status).toEqual(200);
        expect(res.body).toEqual(expectedData.user1.config);
      });

      it("should get /config with auth of user2", async () => {
        const res = await request(app)
          .get("/config")
          .set("Authorization", authorization_user2)
          .send();

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });

      it("should get /config with auth of user3", async () => {
        const res = await request(app)
          .get("/config")
          .set("Authorization", authorization_user3)
          .send();

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });
    });

    /*describe("API Request DELETE /config/:id", () => {
      const requestUrl = "/config/1";
      const sqlBefore =
        "SELECT count(*) AS nbBefore FROM configurations WHERE deleted_at IS NULL";
      const sqlAfter =
        "SELECT count(*) AS nbAfter FROM configurations WHERE deleted_at IS NULL";

      it("should delete not delete /config/1 without auth", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);

        const res = await request(app).delete(requestUrl).send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
        expect(nbBefore).toBe(nbAfter);
      });

      it("should delete /config/1 with auth of user1", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const res = await request(app)
          .delete(requestUrl)
          .set("Authorization", authorization_user1)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(200);
        expect(res.body).toEqual([]);
        expect(nbAfter).toBe(nbBefore - 1);
      });

      it("should not delete /config/2 with auth of user2", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const res = await request(app)
          .delete("/config/2")
          .set("Authorization", authorization_user1)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(400);
        expect(res.body).toEqual(BadRequest);
        expect(nbBefore).toBe(nbAfter);
      });

      it("should not delete /config/1 with auth of user2", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const res = await request(app)
          .delete(requestUrl)
          .set("Authorization", authorization_user2)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
        expect(nbBefore).toBe(nbAfter);
      });

      it("should not delete /config/2 with auth of user3", async () => {
        const { nbBefore } = await executeSQLQuery(sqlBefore);
        const res = await request(app)
          .delete(requestUrl)
          .set("Authorization", authorization_user3)
          .send();
        const { nbAfter } = await executeSQLQuery(sqlAfter);

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
        expect(nbBefore).toBe(nbAfter);
      });
    });*/
  });

  describe("Result Router", () => {
    describe("API Request GET /result", () => {
      it("should get /result without auth", async () => {
        const res = await request(app).get("/result").send();
        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });

      it("should get /result with auth of user1", async () => {
        const res = await request(app)
          .get("/result")
          .set("Authorization", authorization_user1)
          .send();

        console.log("RESULT", res.text);

        expect(res.status).toEqual(200);
        expect(res.body).toEqual(expectedData.user1.result);
      });

      it("should get /result with auth of user2", async () => {
        const res = await request(app)
          .get("/result")
          .set("Authorization", authorization_user2)
          .send();

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });

      it("should get /result with auth of user3", async () => {
        const res = await request(app)
          .get("/result")
          .set("Authorization", authorization_user3)
          .send();

        expect(res.status).toEqual(401);
        expect(res.body).toEqual(Unauthorized);
      });
    });
  });
});
