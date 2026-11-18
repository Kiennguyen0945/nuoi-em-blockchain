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

  it("bỏ được nhiều kiểu whitespace và tab", () => {
    assert.equal(normalizeLookupQuery("\t HS 699 \n"), "699");
  });

  it("đầu vào chỉ có HS sẽ trả rỗng", () => {
    assert.equal(normalizeLookupQuery("HS"), "");
    assert.equal(normalizeLookupQuery("hs"), "");
  });

  it("không bị ảnh hưởng bởi ký tự đặc biệt", () => {
    assert.equal(normalizeLookupQuery("h-s-6-9-3"), "693");
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

  it("matched theo từ khóa hoàn cảnh (full-text đơn giản)", () => {
    assert.equal(recordMatchesQuery(record, "mồ côi"), true);
    assert.equal(recordMatchesQuery(record, "mồcôi"), true);
    assert.equal(recordMatchesQuery(record, "HOÀN CẢNH"), true);
  });

  it("không match khi query quá ngắn hoặc không khớp", () => {
    assert.equal(recordMatchesQuery(record, "6"), false);
    assert.equal(recordMatchesQuery(record, "zzzzz"), false);
    assert.equal(recordMatchesQuery(record, ""), false);
  });

  it("matched với situation null, bản ghi không có situation", () => {
    const recordNoSit = {
      id: "aaaaaaaa-0000-0000-0000-000000000000",
      situation: null as string | null,
    };
    assert.equal(recordMatchesQuery(recordNoSit, "aaaaaaaa"), true);
    assert.equal(recordMatchesQuery(recordNoSit, "anything"), false);
  });

  it("matched khi query có khoảng trắng trong từ khóa tiếng Việt", () => {
    assert.equal(recordMatchesQuery(record, "mồ côi mẹ"), true);
    assert.equal(recordMatchesQuery(record, "cha làm thuê"), true);
  });

  it("hoàn cảnh khớp nhờ bỏ dấu cách trong normalize", () => {
    assert.equal(recordMatchesQuery(record, "hoàn cảnh khó khăn"), true);
  });

  it("matched theo đoạn giữa UUID (không chỉ prefix)", () => {
    // Phần "434c" ở giữa cũng match vì ta dùng includes() trên toàn chuỗi
    assert.equal(recordMatchesQuery(record, "434c"), true);
    assert.equal(recordMatchesQuery(record, "5c64c0f9"), true);
  });
});
