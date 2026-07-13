import { describe,expect,it,vi } from "vitest";

vi.mock("server-only",()=>({}));

import { deterministicEmbedding } from "../../src/services/embedding.service";

describe("deterministic embeddings",()=>{
  it("tokenizes Bangla curriculum text",()=>{
    const vector=deterministicEmbedding("সপ্তম শ্রেণির বিজ্ঞান ও সালোকসংশ্লেষণ");
    expect(vector.some(value=>value>0)).toBe(true);
  });

  it("normalizes equivalent Unicode text consistently",()=>{
    expect(deterministicEmbedding("Science ৭")).toEqual(deterministicEmbedding("Science ৭".normalize("NFKC")));
  });
});
