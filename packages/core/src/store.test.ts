import { describe, test, expect } from "bun:test";
import { slugify } from "./store.ts";

describe("slugify", () => {
  test("converts spaces and special characters to kebab-case", () => {
    expect(slugify("Auth System")).toBe("auth-system");
    expect(slugify("My API Design")).toBe("my-api-design");
    expect(slugify("foo_bar")).toBe("foo-bar");
  });

  test("handles consecutive special characters as single hyphen", () => {
    expect(slugify("foo---bar")).toBe("foo-bar");
    expect(slugify("foo   bar")).toBe("foo-bar");
    expect(slugify("foo___bar")).toBe("foo-bar");
  });

  test("strips leading and trailing hyphens", () => {
    expect(slugify("--foo--")).toBe("foo");
    expect(slugify("-auth-")).toBe("auth");
    expect(slugify("  hello  ")).toBe("hello");
  });

  test("returns empty string for empty or whitespace-only input", () => {
    expect(slugify("")).toBe("");
    expect(slugify("   ")).toBe("");
    expect(slugify("!!!")).toBe("");
  });

  test("converts mixed case to lowercase", () => {
    expect(slugify("FoO BaR")).toBe("foo-bar");
    expect(slugify("JWT")).toBe("jwt");
    expect(slugify("APIv2")).toBe("apiv2");
  });
});
