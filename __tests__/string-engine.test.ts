import { describe, it, expect } from "vitest";
import {
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  toPascalCase,
  removeDuplicateLines,
  removeEmptyLines,
  sortLines,
} from "@/lib/engines/string";

describe("case conversion", () => {
  it("converts a phrase across cases", () => {
    const input = "hello world example";
    expect(toCamelCase(input)).toBe("helloWorldExample");
    expect(toPascalCase(input)).toBe("HelloWorldExample");
    expect(toSnakeCase(input)).toBe("hello_world_example");
    expect(toKebabCase(input)).toBe("hello-world-example");
  });

  it("splits camelCase input back into words", () => {
    expect(toSnakeCase("helloWorldHTTP")).toBe("hello_world_http");
  });
});

describe("line transforms", () => {
  it("removes duplicate lines preserving order", () => {
    expect(removeDuplicateLines("a\nb\na\nc\nb")).toBe("a\nb\nc");
  });

  it("removes empty lines", () => {
    expect(removeEmptyLines("a\n\n\nb\n")).toBe("a\nb");
  });

  it("sorts lines alphabetically", () => {
    expect(sortLines("banana\napple\ncherry")).toBe("apple\nbanana\ncherry");
  });
});
