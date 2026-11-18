import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeLookupQuery,
  recordMatchesQuery,
} from "../../src/lib/public-lookup";

describe("Tra cứu hồ sơ — normalizeLookupQuery", () => {
  it("chuẩn hóa hoa thường và bỏ dấu gạch/hspace", () => {
    assert.equal(normalizeLookupQuery("hs69-3df"), "693DF");
    assert.equal(normalizeLookupQuery("  HS-693 DF  "), "693DF");
    assert.equal(normalizeLookupQuery("abc-123"), "ABC123");
  });

  it("trả rỗng khi input rỗng", () => {
    assert.equal(normalizeLookupQuery(""), "");
  });
});

describe("Tra cứu hồ sơ — recordMatchesQuery", () => {
  const record = {
    id: "693df0a8-9985-434c-9115-5c64c0f97273",
    situation: "Hoàn cảnh khó khăn: mồ côi mẹ, cha làm thuê, Xã A",
  };

  it("matched theo phần đầu của UUID (bỏ gạch)", () => {
    assert.equal(recordMatchesQuery(record, "693df0a8"), true);
    assert.equal(recordMatchesQuery(record, "HS693DF0A8"), true);
  });

  it("matched khi có dấu gạch / chữ thường", () => {
    assert.equal(recordMatchesQuery(record, "693d-f0a8"), true);
    assert.equal(recordMatchesQuery(record, "693df0a8".toLowerCase()), true);
  });

  it("matched theo từ khóa hoàn cảnh", () => {
    assert.equal(recordMatchesQuery(record, "mồ côi"), true);
    assert.equal(recordMatchesQuery(record, "mồcôi"), true);
  });

  it("không match khi query quá ngắn hoặc không khớp", () => {
    assert.equal(recordMatchesQuery(record, "6"), false);
    assert.equal(recordMatchesQuery(record, "zzzzz"), false);
    assert.equal(recordMatchesQuery(record, ""), false);
  });
});
