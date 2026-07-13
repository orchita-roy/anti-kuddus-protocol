import { afterEach,describe,expect,it,vi } from "vitest";

vi.mock("server-only",()=>({}));

import { effectiveRateLimit } from "../../src/lib/rate-limit";

describe("configurable rate limits",()=>{
  const original=process.env.RATE_LIMIT_MULTIPLIER;

  afterEach(()=>{
    if(original===undefined)delete process.env.RATE_LIMIT_MULTIPLIER;
    else process.env.RATE_LIMIT_MULTIPLIER=original;
  });

  it("multiplies limits for evaluation traffic",()=>{
    process.env.RATE_LIMIT_MULTIPLIER="10";
    expect(effectiveRateLimit(20)).toBe(200);
  });

  it("falls back safely for invalid values",()=>{
    process.env.RATE_LIMIT_MULTIPLIER="invalid";
    expect(effectiveRateLimit(20)).toBe(20);
  });
});
