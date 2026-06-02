import { describe, it, expect } from "vitest";
import { sqlToRows, parseSqlInserts } from "@/lib/engines/sql";

describe("SQL engine", () => {
  it("parses a single-row INSERT", () => {
    const sql = "INSERT INTO users (id, name, active) VALUES (1, 'Ada', true);";
    const result = sqlToRows(sql);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual([{ id: 1, name: "Ada", active: true }]);
    }
  });

  it("parses a multi-row INSERT", () => {
    const sql = "INSERT INTO t (a, b) VALUES (1, 'x'), (2, 'y'), (3, NULL);";
    const result = sqlToRows(sql);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual([
        { a: 1, b: "x" },
        { a: 2, b: "y" },
        { a: 3, b: null },
      ]);
    }
  });

  it("handles escaped quotes inside string values", () => {
    const sql = "INSERT INTO q (txt) VALUES ('it''s fine');";
    const result = sqlToRows(sql);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value[0]).toEqual({ txt: "it's fine" });
    }
  });

  it("returns an error when no INSERT is present", () => {
    const result = parseSqlInserts("SELECT * FROM users;");
    expect(result.ok).toBe(false);
  });
});
